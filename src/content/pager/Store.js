import {Stores} from '@nti/lib-store';
import {Array as arr} from '@nti/lib-commons';

const COURSE = Symbol('Course');
const COURSE_TREE = Symbol('Course Tree');
const LESSON = Symbol('Lesson');
const LESSON_NODE = Symbol('Lesson Node');
const SELECTION = Symbol('Selection');
const SELECTION_NODES = Symbol('Selection Nodes');


function isOutlineNode (item) {
	return item && item.isOutlineNode;
}

function isContentOutlineNode (item) {
	//TODO: remove the last condition, its just a way to work around my local content
	return isOutlineNode && item.hasOverviewContent && item.label !== 'Reconstruction and The New South v1';
}

function buildIsSameContentOutlineNode (node) {
	const contentId = node.getContentId ? node.getContentId() : node;
	const id = node.getID ? node.getID() : node;

	return (item) => {
		return isContentOutlineNode(item) && (item.getContentId() === contentId || item.getID() === id);
	};
}

function isOverview (item) {
	return item && item.MimeType === 'application/vnd.nextthought.ntilessonoverview';
}

function isOverviewGroup (item) {
	return item && item.MimeType === 'application/vnd.nextthought.nticourseoverviewgroup';
}

function isVideoRoll (item) {
	return item && item.MimeType === 'application/vnd.nextthought.videoroll';
}

function buildIsSameOverviewItem (node) {
	const id = node.getID ? node.getID() : node;

	return (item) => item && (item.getID() === id || item['target-NTIID'] === id || item['Target-NTIID'] === id);
}

function invert (fn) {
	return (...args) => !fn(...args);
}

//Has to match all predicates
function combine (...fns) {
	return (...args) => {
		for (let fn of fns) {
			if (!fn(...args)) { return false; }
		}

		return true;
	};
}

//Has to match one predicate
function oneOf (...fns) {
	return (...args) => {
		for (let fn of fns) {
			if (fn(...args)) { return true; }
		}

		return false;
	};
}

const isNotPageableContent = oneOf(
	//Its not pagable if its an outline node, but not a content outline node
	combine(isOutlineNode, invert(isContentOutlineNode)),
	isOverview,
	isOverviewGroup,
	isVideoRoll
);


export default class ContentPagerStore extends Stores.BoundStore {

	needsReload () {
		const {course, lesson, selection} = this.binding;

		return course !== this[COURSE] || lesson !== this[LESSON] || selection !== this[SELECTION];
	}


	getCourseContentTree () {
		const {course} = this.binding;

		if (course !== this[COURSE]) {
			this[COURSE] = course;
			this[COURSE_TREE] = course.getContentTree();
		}

		return this[COURSE_TREE];
	}


	getLessonNode () {
		const courseTree = this.getCourseContentTree();
		const {lesson} = this.binding;

		if (lesson !== this[LESSON]) {
			this[LESSON] = lesson;
			this[LESSON_NODE] = courseTree
				.find(buildIsSameContentOutlineNode(lesson))
				.find(isOverview);
		}

		return this[LESSON_NODE];
	}


	getSelectionNodes () {
		const lessonNode = this.getLessonNode();
		const {selection} = this.binding;

		if (selection === this[SELECTION]) { return this[SELECTION_NODES]; }

		this[SELECTION] = selection;

		const items = arr.ensure(selection);

		let node = lessonNode;
		let nodes = [];

		for (let item of items) {
			node = node.find(combine(invert(isOverviewGroup), buildIsSameOverviewItem(item)));
			nodes.push(node);
		}

		return nodes;
	}


	async load () {
		if (!this.needsReload()) { return; }

		this.set({
			loading: true
		});

		try {
			const courseTree = this.getCourseContentTree();
			const lessonNode = this.getLessonNode();
			const selectionNodes = this.getSelectionNodes();

			const lessonInfo = await this.getLessonInfo(courseTree, lessonNode, selectionNodes);
			const selectionInfo = await this.getSelectionInfo(courseTree, lessonNode, selectionNodes);
			const pagingInfo = await this.getPagingInfo(courseTree, lessonNode, selectionNodes);

			debugger;

			this.set({
				loading: false,
				...lessonInfo,
				...selectionInfo,
				...pagingInfo
			});
		} catch (e) {
			debugger;
			this.set({
				loading: true,
				error: e
			});
		}
	}


	async getLessonInfo (courseTree, lessonNode, selectionNodes) {
		const isEmpty = await lessonNode.isEmptyNode();

		if (isEmpty) { throw new Error('Unable to find lesson.'); }

		const lessonOverview = await lessonNode.getItem();
		const lessonWalker = lessonNode.createTreeWalker({
			skip: isNotPageableContent
		});

		const selectedNode = selectionNodes && selectionNodes[selectionNodes.length - 1];
		const selectedItem = selectedNode && await selectedNode.getItem();
		const selectedItemID = selectedItem && selectedItem.getID();

		const totalInLesson = await lessonWalker.getNodeCount();
		const indexInlesson = await lessonWalker.getIndexOf((item) => {
			return item.getID() === selectedItemID;
		});

		return {
			lessonOverview,
			totalInLesson,
			indexInlesson
		};
	}


	async getSelectionInfo (courseTree, lessonNode, selectionNodes) {
		if (!selectionNodes || !selectionNodes.length) {
			throw new Error('Unable to find selection');
		}

		const nodes = selectionNodes.slice(-2);//for now just look at the last two nodes...
		const selection = nodes[nodes.length - 1];
		const selectionItem = await selection.getItem();

		if (nodes.length === 1) {
			return {
				selectedItem: selectionItem,
				selectionTotal: 1,
				selectionIndex: 1
			};
		}

		debugger;
	}


	async getPagingInfo (courseTree, lessonNode, selectionNodes) {
		if (!courseTree || !selectionNodes || !selectionNodes.length) {
			throw new Error('Unable to find paging info.');
		}

		const selection = selectionNodes[selectionNodes.length - 1];
		const courseWalker = selection.createTreeWalker(courseTree, {
			skip: isNotPageableContent
		});

		const nextNode = await courseWalker.selectNext().getCurrentNode();
		const prevNode = await courseWalker.selectPrev().getCurrentNode();

		const next = await nextNode.getItem();
		const prev = await prevNode.getItem();

		return {
			next,
			prev
		};
	}
}
