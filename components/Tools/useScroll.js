import React, { useState, useEffect } from 'react';

export const useScroll = callback => {
	const [scrollDirection, setScrollDirection] = useState(true);

	const handleScroll = () => {
		const direction = (() => {
			// if scroll is at top or at bottom return null,
			// so that it would be possible to catch and enforce a special behaviour in such a case.
			if (
				window.pageYOffset === 0 ||
				window.innerHeight + Math.ceil(window.pageYOffset) >=
				document.body.offsetHeight
			)
				return null;
			// otherwise return the direction of the scroll
			return scrollDirection < window.pageYOffset ? 'down' : 'up';
		})();

		callback(direction);
		setScrollDirection(window.pageYOffset);
	};

	// adding and cleanning up de event listener
	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
};

export default props => {
	const [elementVisible, setElementVisible] = useState(true);
	const { scrollDirection } = props;

	// when scroll direction changes element visibility adapts, but can do anything we want it to do
	// U can use ScrollDirection and implement some page shake effect while scrolling
	useEffect(() => {
		setElementVisible(
			scrollDirection === 'down'
				? true
				: scrollDirection === 'up'
					? true
					: true,
		);
	}, [scrollDirection]);

	return (
		<div
			style={{
				background: 'transparent',
				padding: '20px',
				position: 'fixed',
				width: '100%',
				zIndex: '999',
			}}
		>
			element
    </div>
	);
};
