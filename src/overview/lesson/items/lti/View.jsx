import React from 'react';
import PropTypes from 'prop-types';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';
import { List, Grid } from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

export default
@Registry.register('application/vnd.nextthought.ltiexternaltoolasset')
class LTIExternalToolAsset extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([Grid, List]),
		item: PropTypes.object,
		onRequirementChange: PropTypes.func
	}

	render () {
		const { layout, item, onRequirementChange, ...otherProps } = this.props;

		const Cmp = layout === List ? ListCmp : GridCmp;

		const required = item.CompletionRequired;

		const requiredLabel = item && item.isCompletable && item.isCompletable() && onRequirementChange ? (
			<RequirementControl record={item} onChange={onRequirementChange}/>
		) : required && (
			<Required key="required-label"/>
		);

		return (
			<Cmp layout={layout} item={item} requiredLabel={requiredLabel} {...otherProps} />
		);
	}
}
