const CompletedCheckIcon = styled('i').attrs({
	className: 'icon-check-10 completed-check',
})`
	display: inline-block;
	border: 2px solid white;
	border-radius: 18px;
	width: 18px;
	height: 18px;
	text-align: center;
	font-size: 0.875rem;
	line-height: 0.875rem;
	vertical-align: middle;

	& + span {
		margin-left: 0.3rem;
	}

	@media (--respond-to-handhelds) {
		border-radius: 14px;
		width: 14px;
		height: 14px;
		font-size: 10px;
		line-height: 10px;
	}
`;

export default CompletedCheckIcon;
