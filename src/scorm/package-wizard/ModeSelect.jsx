import React from 'react';
import Template from './template';

const ModeSelect = ({ onModeSelect }) => {
	return (
		<div className="course-panel-templatechooser">
			<div className="course-panel-content">
				<div className="options-container">
					<Template />
					<Template />
				</div>
			</div>
			<div className="course-panel-controls">
				{this.renderSaveCmp()}
				{this.renderCancelCmp()}
			</div>
		</div>
	)
});