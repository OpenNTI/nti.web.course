import { Stores } from '@nti/lib-store';
import { Array as arr } from '@nti/lib-commons';

const COURSE = Symbol('Course');
const COURSE_TREE = Symbol('Course Tree');
const LESSON = Symbol('Lesson');
const LESSON_NODE = Symbol('Lesson Node');
const SELECTION = Symbol('Selection');
const SELECTION_NODES = Symbol('Selection Nodes');

function isCourse(item) {
	return item && item.isCourse;
}

function isOutlineNode(item) {
	return item && item.isOutlineNode;
}

function isContentOutlineNode(item) {
	return isOutlineNode && item.hasOverviewContent;
}

function isConstrainedOutlineNode(item) {
	return isOutlineNode(item) && item.contentIsConstrained;
}

function buildIsSameContentOutlineNode(node) {
	const contentId = node.getContentId ? node.getContentId() : node;
	const id = node.getID ? node.getID() : node;

	return item => {
		return (
			isContentOutlineNode(item) &&
			(item.getContentId() === contentId || item.getID() === id)
		);
	};
}

function isOverview(item) {
	return (
		item &&
		item.MimeType === 'application/vnd.nextthought.ntilessonoverview'
	);
}

function isOverviewGroup(item) {
	return (
		item &&
		item.MimeType === 'application/vnd.nextthought.nticourseoverviewgroup'
	);
}

function isVideoRoll(item) {
	return item && item.MimeType === 'application/vnd.nextthought.videoroll';
}

function isRelatedWorkRef(item) {
	return (
		item && item.MimeType === 'application/vnd.nextthought.relatedworkref'
	);
}

function isCompletionRequired(item) {
	return item && item.CompletionRequired;
}

function buildIsSameOverviewItem(node) {
	const id = node.isVideo
		? node.getLinkProperty('ref', 'RefNTIID')
		: node.getID
		? node.getID()
		: node;

	return item => {
		if (item && item.isVideo) {
			const refID = item.getLinkProperty('ref', 'RefNTIID');

			if (refID === id) {
				return true;
			}
		}

		return (
			item &&
			(item.getID() === id ||
				item.target === id ||
				item['target-NTIID'] === id ||
				item['Target-NTIID'] === id)
		);
	};
}

function invert(fn) {
	return (...args) => !fn(...args);
}

//Has to match all predicates
function combine(...fns) {
	return (...args) => {
		for (let fn of fns) {
			if (!fn(...args)) {
				return false;
			}
		}

		return true;
	};
}

//Has to match one predicate
function oneOf(...fns) {
	return (...args) => {
		for (let fn of fns) {
			if (fn(...args)) {
				return true;
			}
		}

		return false;
	};
}

const isNotPageableContent = combine(
	invert(isConstrainedOutlineNode),
	oneOf(isCourse, isOutlineNode, isOverview, isOverviewGroup, isVideoRoll)
);

export default class ContentPagerStore extends Stores.BoundStore {
	needsReload() {
		const { course } = this.binding;

		return course !== this[COURSE];
	}

	needsUpdate() {
		const { selection, lesson } = this.binding;

		return selection !== this[SELECTION] || lesson !== this[LESSON];
	}

	get requiredOnly() {
		const { course, requiredOnly } = this.binding;

		return course && course.CompletionPolicy && requiredOnly;
	}

	get skipNodes() {
		return this.requiredOnly
			? oneOf(isNotPageableContent, invert(isCompletionRequired))
			: isNotPageableContent;
	}

	get ignoreChildrenNodes() {
		return this.requiredOnly
			? combine(
					invert(isNotPageableContent),
					invert(isCompletionRequired)
			  )
			: null;
	}

	getCourseContentTree() {
		const { course } = this.binding;

		if (course !== this[COURSE]) {
			this[COURSE] = course;
			this[COURSE_TREE] = course.getContentTree();
		}

		return this[COURSE_TREE];
	}

	getLessonNode() {
		const courseTree = this.getCourseContentTree();
		const { lesson } = this.binding;

		if (lesson !== this[LESSON]) {
			this[LESSON] = lesson;
			this[LESSON_NODE] = courseTree
				.find(buildIsSameContentOutlineNode(lesson))
				.find(isOverview);
		}

		return this[LESSON_NODE];
	}

	getSelectionNodes() {
		const lessonNode = this.getLessonNode();
		const { selection } = this.binding;

		if (selection === this[SELECTION]) {
			return this[SELECTION_NODES];
		}

		this[SELECTION] = selection;

		const items = arr.ensure(selection);

		let node = lessonNode;
		let nodes = [];

		for (let item of items) {
			node = node.find(
				combine(invert(isOverviewGroup), buildIsSameOverviewItem(item))
			);
			nodes.push(node);
		}

		return nodes;
	}

	clear() {
		delete this[COURSE];
		delete this[LESSON];
		delete this[SELECTION];
	}

	#doLoad = async () => {
		try {
			const courseTree = this.getCourseContentTree();
			const lessonNode = this.getLessonNode();
			const selectionNodes = this.getSelectionNodes();

			const lessonInfo = await this.getLessonInfo(
				courseTree,
				lessonNode,
				selectionNodes
			);
			const location = await this.getLocationInfo(
				courseTree,
				lessonNode,
				selectionNodes
			);
			const pagingInfo = await this.getPagingInfo(
				courseTree,
				lessonNode,
				selectionNodes
			);

			this.set({
				loading: false,
				lessonInfo,
				location,
				...pagingInfo,
			});
		} catch (e) {
			this.set({
				loading: true,
				error: e,
			});
		}
	};

	async updateOnAssignmentSubmit(assignment) {
		const next = this.get('next');
		const previous = this.get('previous');

		const needsUpdate = item => {
			return (
				item &&
				item.contentIsConstrained &&
				item.contentIsConstrainedBy &&
				item.contentIsConstrainedBy(assignment) &&
				item.refresh()
			);
		};

		try {
			const nextUpdate = await needsUpdate(next.item);
			const prevUpdate = await needsUpdate(previous.item);

			if (nextUpdate || prevUpdate) {
				this.update();
			}
		} catch (e) {
			//swallow
		}
	}

	update() {
		delete this[SELECTION];
		this.#doLoad();
	}

	async load() {
		const needsReload = this.needsReload();
		const needsUpdate = this.needsUpdate();

		if (!needsReload && !needsUpdate) {
			return;
		}

		if (needsReload) {
			this.set({
				loading: true,
				location: null,
				lessonInfo: null,
				next: null,
				previous: null,
			});
		} else {
			this.set({
				location: null,
				next: null,
				previous: null,
			});
		}

		this.#doLoad();
	}

	async getLessonInfo(courseTree, lessonNode, selectionNodes) {
		const isEmpty = await lessonNode.isEmptyNode();

		if (isEmpty) {
			throw new Error('Unable to find lesson.');
		}

		const overview = await lessonNode.getItem();
		const lessonWalker = lessonNode.createTreeWalker({
			skip: this.skipNodes,
			ignoreChildren: isRelatedWorkRef, //don't count sub pages in the lesson counts
		});

		const outlineNode = lessonNode && lessonNode.findParent(isOutlineNode);
		const outline = lessonNode && (await outlineNode.getItem());

		//the first item in the selection should be in a lesson (ex. [RelatedWorkRef, Sub-Page])
		//most items should just be a list of one node.
		const selectedNode = selectionNodes && selectionNodes[0];
		const selectedItem = selectedNode && (await selectedNode.getItem());
		const isSameSelectedItem = buildIsSameOverviewItem(selectedItem);

		const totalItems = await lessonWalker.getNodeCount();
		const currentItemIndex = await lessonWalker.getIndexOf(
			isSameSelectedItem
		);

		const remainingNodes = await lessonWalker.getNodesAfter(
			isSameSelectedItem
		);
		const nextNode = remainingNodes[0];
		const nextItem = nextNode && (await nextNode.getItem());

		return {
			href: overview.href,
			id: overview.getID(),
			title: overview.title,
			outlineNodeId: outline && outline.getID(),
			totalItems,
			currentItemIndex,
			nextItem,
		};
	}

	async getLocationInfo(courseTree, lessonNode, selectionNodes) {
		if (!selectionNodes || !selectionNodes.length) {
			throw new Error('Unable to find selection');
		}

		if (selectionNodes.length === 1) {
			return this.getFlatLocationInfo(selectionNodes[0]);
		}

		return this.getHierarchyLocationInfo(selectionNodes);
	}

	async getFlatLocationInfo(selectionNode) {
		const item = await selectionNode.getItem();

		if (!item) {
			throw new Error('Unable to find single selection.');
		}

		const selectionWalker = selectionNode.createTreeWalker({
			skip: isNotPageableContent,
		});

		const total = await selectionWalker.getNodeCount();

		return {
			item,
			totalPages: total,
			currentPage: 0,
		};
	}

	async getHierarchyLocationInfo(selectionNodes) {
		const parent = selectionNodes[0];

		const items = await Promise.all(
			selectionNodes.map(node => node.getItem())
		);
		const item = items[items.length - 1];

		if (!item) {
			throw new Error('Unable to find hierarchy selection.');
		}

		const itemId = item && item.getID();
		const selectionWalker = parent.createTreeWalker({
			skip: isNotPageableContent,
		});

		const total = await selectionWalker.getNodeCount();
		const index = await selectionWalker.getIndexOf(n => {
			return n.getID() === itemId;
		});

		return {
			item,
			items,
			totalPages: total,
			currentPage: index,
		};
	}

	async getPagingInfo(courseTree, lessonNode, selectionNodes) {
		if (!courseTree || !selectionNodes || !selectionNodes.length) {
			throw new Error('Unable to find paging info.');
		}

		const selection = selectionNodes[selectionNodes.length - 1];
		const courseWalker = selection.createTreeWalker(courseTree, {
			skip: this.skipNodes,
			ignoreChildren: this.ignoreChildrenNodes,
		});

		const nextNode = await courseWalker.selectNext().getCurrentNode();
		const prevNode = await courseWalker.selectPrev().getCurrentNode();

		const nextLessonNode =
			nextNode && nextNode.findParentOrSelf(isOutlineNode);
		const prevLessonNode =
			prevNode && prevNode.findParentOrSelf(isOutlineNode);

		const nextLesson = nextLessonNode && (await nextLessonNode.getItem());
		const prevLesson = prevLessonNode && (await prevLessonNode.getItem());

		const nextRelatedWorkRefNode =
			nextNode && nextNode.findParent(isRelatedWorkRef);
		const prevRelatedWorkRefNode =
			prevNode && prevNode.findParent(isRelatedWorkRef);

		const nextRelatedWorkRef =
			nextRelatedWorkRefNode && (await nextRelatedWorkRefNode.getItem());
		const prevRelatedWorkRef =
			prevRelatedWorkRefNode && (await prevRelatedWorkRefNode.getItem());

		const nextItem = nextNode && (await nextNode.getItem());
		const prevItem = prevNode && (await prevNode.getItem());

		const next = !nextItem
			? null
			: {
					isNextLink: true,
					item: nextItem,
					lesson: nextLesson,
					relatedWorkRef: nextRelatedWorkRef,
			  };
		const previous = !prevItem
			? null
			: {
					isPrevLink: true,
					item: prevItem,
					lesson: prevLesson,
					relatedWorkRef: prevRelatedWorkRef,
			  };

		return {
			next,
			previous,
		};
	}
}
