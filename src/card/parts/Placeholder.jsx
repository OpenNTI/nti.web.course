import './Card.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Placeholder} from '@nti/web-commons';

import Title from './Title';

CourseCardPlaceholder.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(['list-item', 'card', 'auto'])
};
export default function CourseCardPlaceholder ({className, variant = 'card'}) {
    //TODO: support auto variant
    
    return (
        <div
            data-testid="course-card-placeholder"
            className={cx(className, 'nti-course-card-container', variant, 'placeholder')}
        >
            <Placeholder.Image className="nti-course-card-image" />
            <Title.Placeholder/>
        </div>
    );
}