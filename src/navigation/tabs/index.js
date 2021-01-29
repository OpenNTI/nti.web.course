import Store from './Store';

export { default as View } from './View';
export { default as Editor } from './editor';

export const Tabs = Store.Tabs;
export const getTabLabelForCourse = (...args) => Store.getTabLabelForCourse(...args);
