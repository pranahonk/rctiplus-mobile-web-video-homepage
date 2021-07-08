import { homeStoryEvent } from '../../utils/appier';

/*
    zuck.js
    https://github.com/ramon82/zuck.js
    MIT License
*/
module.exports = (window => {
	/* Utilities */
	const query = function (qs) {
		return document.querySelectorAll(qs)[0];
	};

	let taData = []

	const get = function (array, what) {
		if (array) {
			return array[what] || '';
		} else {
			return '';
		}
	};

	const each = function (arr, func) {
		if (arr) {
			const total = arr.length;

			for (let i = 0; i < total; i++) {
				func(i, arr[i]);
			}
		}
	};

	const setVendorVariable = function (ref, variable, value) {
		const variables = [
			variable.toLowerCase(),
			`webkit${variable}`,
			`MS${variable}`,
			`o${variable}`
		];

		each(variables, (i, val) => {
			ref[val] = value;
		});
	};

	const addVendorEvents = function (el, func, event) {
		const events = [
			event.toLowerCase(),
			`webkit${event}`,
			`MS${event}`,
			`o${event}`
		];

		each(events, (i, val) => {
			el.addEventListener(val, func, false);
		});
	};

	const onAnimationEnd = function (el, func) {
		addVendorEvents(el, func, 'AnimationEnd');
	};

	const onTransitionEnd = function (el, func) {
		if (!el.transitionEndEvent) {
			el.transitionEndEvent = true;

			addVendorEvents(el, func, 'TransitionEnd');
		}
	};

	const prepend = function (parent, child) {
		if (parent.firstChild) {
			parent.insertBefore(child, parent.firstChild);
		} else {
			parent.appendChild(child);
		}
	};

	const generateId = () => {
		return 'stories-' + Math.random().toString(36).substr(2, 9);
	}

	/* Zuckera */
	const ZuckJS = function (timeline, options) {
		const zuck = this;

		const isJson = (item) => {
			item = typeof item !== "string"
					? JSON.stringify(item)
					: item;
	
			try {
					item = JSON.parse(item);
			} catch (e) {
					return false;
			}
	
			if (typeof item === "object" && item !== null) {
					return true;
			}
	
			return false;
		}

		const parsingMessage = (event) => {
			if (!isJson(event.data)) return;
			const data = JSON.parse(event.data);
			const storyViewer = query('#zuck-modal .viewing')
			const currentViewingStory = zuck.data[storyViewer.getAttribute("data-story-id")]

			if (data?.state) {
				switch(data.state) {
					case 'init':
						{
							const story = zuck.data.find(element => element.id == data.storyId);
							const item = story.items.find(element => element.id == data.itemId);

							item.contentType = data.contentType;

							if (item.contentType == 'image') {
								const items = storyViewer.querySelectorAll('[data-index].active');
								const itemPointer = items[0]

								// start progress bar soon when currently displaying ads is an image
								if (currentViewingStory.items[currentViewingStory.currentItem].id === item.id) {
									storyViewer.classList.remove("loading")
									storyViewer.classList.remove("initial")
								}

							} else {

								// Stop now for a moment the progress bar when it is a video ads
								// NOTE!! It will start only when video are playing
								if (currentViewingStory.items[currentViewingStory.currentItem].id === item.id) {
									storyViewer.classList.add("initial")
								}

								const storyId = zuck.internalData['currentStory'];
								let items = query(`#zuck-modal [data-story-id="${storyId}"]`);
								items = items.querySelectorAll('[data-index].active');

								if (items) {
									const storyViewer = query(`#zuck-modal .story-viewer[data-story-id="${storyId}"]`);
									playVideoItem(storyViewer, [items[0], items[1]], false);
								}
							}
						}
						break;
					case 'play':
						{
							const items = storyViewer.querySelectorAll('[data-index].active');
							const itemPointer = items[0];
							
							setVendorVariable(
								itemPointer.getElementsByTagName('b')[0].style,
								'AnimationDuration',
								`${data.duration}s`
							)

							// When video are ready and playing start the progress bar and tell user it is no longer loading
							storyViewer.classList.remove("loading")
							storyViewer.classList.remove("initial")
						}
						break;
					case 'unmute':
						{
							if (storyViewer) {
								storyViewer.classList.remove('paused');

								if (storyViewer.classList.contains('muted')) {
									storyViewer.classList.remove('muted');
								}
							}
						}
						break;
					case 'onplay':
						{
							storyViewer.classList.remove('stopped');
							storyViewer.classList.remove('paused');
							storyViewer.classList.remove('loading');
						}
						break;
					case 'onload':
						{
							storyViewer.classList.remove('loading');
						}
						break;
					case 'onwaiting':
						{
							if (data.paused) {
								storyViewer.classList.add('paused');
								storyViewer.classList.add('loading');
							}
						}
						break;
					case 'touchNext':
						zuck.navigateItem('next', true)
						break;
					case 'touchPrev':
						zuck.navigateItem('previous', true)
						break;
					case 'onmute':
						{
							// TEMP FIX
							/* if (data.muted) {
								storyViewer.classList.add('muted');
							} else {
								storyViewer.classList.remove('muted');
							} */
						}
						break;
					case "holdStory":
						storyViewer.classList.add('paused');
						break
					case "releaseStory":
						storyViewer.classList.remove('paused');
						break
				}
			}
		}

		window.addEventListener('message', (event) => {
			parsingMessage(event);
		}, false);

		const option = function (name, prop) {
			const type = function (what) {
				return typeof what !== 'undefined';
			};
			if (prop) {
				if (type(options[name])) {
					return type(options[name][prop])
						? options[name][prop]
						: optionsDefault[name][prop];
				} else {
					return optionsDefault[name][prop];
				}
			} else {
				return type(options[name]) ? options[name] : optionsDefault[name];
			}
		};

		const fullScreen = function (elem, cancel) {
			const func = 'RequestFullScreen';
			const elFunc = 'requestFullScreen'; // crappy vendor prefixes.

			try {
				if (cancel) {
					if (
						document.fullscreenElement ||
						document['webkitFullscreenElement'] ||
						document['mozFullScreenElement'] ||
						document['msFullscreenElement']
					) {
						if (document.exitFullscreen) {
							document.exitFullscreen()
								.catch(() => { });
						} else if (document['mozCancelFullScreen']) {
							document['mozCancelFullScreen']()
								.catch(() => { });
						} else if (document['mozCancelFullScreen']) {
							document['mozCancelFullScreen']()
								.catch(() => { });
						}
					}
				} else {
					if (elem[elFunc]) {
						elem[elFunc]();
					} else if (elem[`ms${func}`]) {
						elem[`ms${func}`]();
					} else if (elem[`moz${func}`]) {
						elem[`moz${func}`]();
					} else if (elem[`webkit${func}`]) {
						elem[`webkit${func}`]();
					}
				}
			} catch (e) {
				console.warn('[Zuck.js] Can\'t access fullscreen');
			}
		};

		const translate = function (element, to, duration, ease) {
			const direction = to > 0 ? 1 : -1;
			const to3d = (Math.abs(to) / query('#zuck-modal').offsetWidth) * 90 * direction;
			if (option('cubeEffect')) {
				const scaling = to3d === 0 ? 'scale(0.95)' : 'scale(0.930,0.930)';

				setVendorVariable(
					query('#zuck-modal-content').style,
					'Transform',
					scaling
				);

				// DEBUGGING

				if (to3d < -90 || to3d > 90) {
					return false;
				}
			}

			const transform = !option('cubeEffect')
				? `translate3d(${to}px, 0, 0)`
				: `rotateY(${to3d}deg)`;

			if (element) {
				setVendorVariable(element.style, 'TransitionTimingFunction', ease);
				setVendorVariable(element.style, 'TransitionDuration', `${duration}ms`);
				setVendorVariable(element.style, 'Transform', transform);
			}
		};

		const findPos = function (obj, offsetY, offsetX, stop) {
			let curleft = 0;
			let curtop = 0;

			if (obj) {
				if (obj.offsetParent) {
					do {
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;

						if (obj === stop) {
							break;
						}
					} while ((obj = obj.offsetParent));
				}

				if (offsetY) {
					curtop = curtop - offsetY;
				}

				if (offsetX) {
					curleft = curleft - offsetX;
				}
			}

			return [curleft, curtop];
		};

		if (typeof timeline === 'string') {
			timeline = document.getElementById(timeline);
		}

		if (!timeline.id) {
			timeline.setAttribute('id', generateId());
		}

		const timeAgo = function (time) {
			time = Number(time) * 1000;

			const dateObj = new Date(time);
			const dateStr = dateObj.getTime();
			let seconds = (new Date().getTime() - dateStr) / 1000;

			const language = option('language', 'time');

			const formats = [
				[60, ` ${language['seconds']}`, 1], // 60
				[120, `1 ${language['minute']}`, ''], // 60*2
				[3600, ` ${language['minutes']}`, 60], // 60*60, 60
				[7200, `1 ${language['hour']}`, ''], // 60*60*2
				[86400, ` ${language['hours']}`, 3600], // 60*60*24, 60*60
				[172800, ` ${language['yesterday']}`, ''], // 60*60*24*2
				[604800, ` ${language['days']}`, 86400]
			];

			let currentFormat = 1;
			if (seconds < 0) {
				seconds = Math.abs(seconds);

				currentFormat = 2;
			}

			let i = 0;
			let format = void 0;
			while ((format = formats[i++])) {
				if (seconds < format[0]) {
					if (typeof format[2] === 'string') {
						return format[currentFormat];
					} else {
						return Math.floor(seconds / format[2]) + format[1];
					}
				}
			}

			const day = dateObj.getDate();
			const month = dateObj.getMonth();
			const year = dateObj.getFullYear();

			return `${day}/${month + 1}/${year}`;
		};

		/* options */
		const id = timeline.id;
		const optionsDefault = {
			skin: 'snapgram',
			avatars: true,
			stories: [],
			backButton: true,
			backNative: false,
			paginationArrows: false,
			previousTap: true,
			autoFullScreen: false,
			openEffect: true,
			cubeEffect: false,
			list: false,
			localStorage: true,
			callbacks: {
				onOpen: function (storyId, callback) {
					callback();
				},
				onView: function (storyId) { },
				onEnd: function (storyId, callback) {
					callback();
				},
				onClose: function (storyId, callback) {
					callback();
				},
				onNextItem: function (storyId, nextStoryId, callback) {
					callback();
				},
				onNavigateItem: function (storyId, nextStoryId, callback) {
					callback();
				}
			},
			template: {
				timelineItem(itemData) {
					return `
              <div class="story ${get(itemData, 'seen') === true ? 'seen' : ''}">
                <a class="item-link" href="${get(itemData, 'link')}">
                  <span class="item-preview">
                    <img lazy="eager" src="${
						(option('avatars') || !get(itemData, 'currentPreview'))
							? get(itemData, 'photo')
							: get(itemData, 'currentPreview')
						}" />
                  </span>
                  <span class="info" itemProp="author" itemScope itemType="http://schema.org/Person">
                    <strong class="name" itemProp="name">${get(itemData, 'name')}</strong>
                    <span class="time">${get(itemData, 'lastUpdatedAgo')}</span>
                  </span>
                </a>
                
                <ul class="items"></ul>
              </div>`;
				},

				timelineStoryItem(itemData) {
					return `<a href="${get(itemData, 'src')}"
                        data-link="${get(itemData, 'link')}"
                        data-linkText="${get(itemData, 'linkText')}"
                        data-time="${get(itemData, 'time')}"
                        data-type="${get(itemData, 'type')}"
                        data-title="${get(itemData, 'title')}
                        data-length="${get(itemData, 'length')}">
                      <img loading="auto" src="${get(itemData, 'preview')}" />
                    </a>`;
				},

				/** Deprecated: modify this for story ads */
				/* viewerItem(storyData, currentStoryItem) {
					return `<div class="story-viewer">
                      <div class="head">
												<div class="left">
                          ${option('backButton') ? '<a class="back">&lsaquo;</a>' : ''}
  
                          <span class="item-preview">
                            <img lazy="eager" class="profilePhoto" src="${get(storyData, 'photo')}" />
                          </span>
  
                          <div class="info">
                            <strong class="name story-item-title" id="story-item-title">${storyData.items[currentStoryItem].title}</strong>
                            <span class="time">${get(storyData, 'timeAgo')}</span>
                          </div>
                        </div>
                        
                        <div class="right">
													<span class="time">${get(currentStoryItem, 'timeAgo')}</span>
                          <span class="loading"></span>
                          <a class="close" tabIndex="2">&#9587;</a>
                        </div>
                      </div>
  
                      <div class="slides-pointers">
                        <div class="wrap"></div>
                      </div>
  
                    ${option('paginationArrows')
										? `<div class="slides-pagination">
												<span class="previous">&lsaquo;</span>
												<span class="next">&rsaquo;</span>
											</div>`
											: ``
										}
                    </div>`;
				}, */

				viewerItem(storyData, currentStoryItem) {
					return `<div class="story-viewer">
                      <div class="head${storyData.items[currentStoryItem].type == 'ads' ? ' story-ads-content': ''}">
												<div class="left">
                          <span class="item-preview">
                            <img lazy="eager" class="profilePhoto" src="${get(storyData, 'photo')}" />
                          </span>
  
                          <div class="info">
                            <strong class="name story-item-title" id="story-item-title">${storyData.items[currentStoryItem].title}</strong>
                            <span class="time">${get(storyData, 'timeAgo')}</span>
                          </div>
                        </div>
                        
                        <div class="right">
                          <span class="loading"></span>
                          <a class="close" tabIndex="2">&#9587;</a>
                        </div>
                      </div>
  
                      <div class="slides-pointers">
                        <div class="wrap"></div>
                      </div>
  
                    ${option('paginationArrows')
										? `<div class="slides-pagination">
												<span class="previous">&lsaquo;</span>
												<span class="next">&rsaquo;</span>
											</div>`
											: ``
										}
                    </div>`;
				},

				viewerItemPointer(index, currentIndex, item) {
					return `<span 
                      class="${currentIndex === index ? 'active' : ''} ${get(item, 'seen') === true ? 'seen' : ''}"
                      data-index="${index}" data-item-id="${get(item, 'id')}">
                        <b style="animation-duration:${get(item, 'length') === '' ? '3' : get(item, 'length')}s"></b>
                    </span>`;
				},

				viewerItemBody(index, currentIndex, item) {
					return `<div 
                      class="item${get(item, 'seen') === true ? ' seen' : ''}${currentIndex === index ? ' active' : ''}"
                      data-time="${get(item, 'time')}" data-type="${get(item, 'type')}" data-index="${index}" data-item-id="${get(item, 'id')}">
                      ${
												get(item, 'type') === 'video'
												? get(item, 'videoType') === 'mpd'
													? `<video class="media ${get(item, 'tagClass')}" muted webkit-playsinline playsinline ${get(item, 'type')}>
															<source src="${get(item, 'src')}" type="application/dash+xml">
														</video>
														<b class="tip muted">${option('language', 'unmute')}</b>`
													: `<video class="media" muted webkit-playsinline playsinline preload="auto" src="${get(item, 'src')}" ${get(item, 'type')}></video>
														<b class="tip muted">${option('language', 'unmute')}</b>`
												: get(item, 'type') === 'ads'
													?	`<div id=${get(item, 'preview')} ${get(item, 'type')}></div>`
													: `<img loading="auto" class="media" src="${get(item, 'src')}" ${get(item, 'type')} alt="${get(item, 'title')}" />
                      `}
  
                      ${
												get(item, 'link')
												? `<a id="${`link-${item.id}`}" class="tip link link-move" href="${get(item, 'link')}" rel="noopener" target="_parent">
													${!get(item, 'linkText') || get(item, 'linkText') === '' ? option('language', 'visitLink') : get(item, 'linkText')}
													</a>`
												: ``
											}
                  </div>`;
				}
			},
			language: {
				unmute: 'Touch to unmute',
				keyboardTip: 'Press space to see next',
				visitLink: 'Visit link',
				time: {
					ago: 'ago',
					hour: 'hour ago',
					hours: 'hours ago',
					minute: 'minute ago',
					minutes: 'minutes ago',
					fromnow: 'from now',
					seconds: 'seconds ago',
					yesterday: 'yesterday',
					tomorrow: 'tomorrow',
					days: 'days ago'
				}
			}
		};

		/* modal */
		const ZuckModal = () => {
			let modalZuckContainer = query('#zuck-modal');

			if (!modalZuckContainer && !zuck.hasModal) {
				zuck.hasModal = true;

				modalZuckContainer = document.createElement('div');
				modalZuckContainer.id = 'zuck-modal';

				if (option('cubeEffect')) {
					modalZuckContainer.className = 'with-cube';
				}

				modalZuckContainer.innerHTML = '<div id="zuck-modal-content"></div>';
				modalZuckContainer.style.display = 'none';

				modalZuckContainer.setAttribute('tabIndex', '1');
				modalZuckContainer.onkeyup = ({ keyCode }) => {
					const code = keyCode;

					if (code === 27) {
						modal.close();
					} else if (code === 13 || code === 32) {
						modal.next();
					}
				};

				if (option('openEffect')) {
					modalZuckContainer.classList.add('with-effects');
				}

				onTransitionEnd(modalZuckContainer, () => {
					if (modalZuckContainer.classList.contains('closed')) {
						modalContent.innerHTML = '';
						modalZuckContainer.style.display = 'none';
						modalZuckContainer.classList.remove('closed');
						modalZuckContainer.classList.remove('animated');
					}
				});

				document.body.appendChild(modalZuckContainer);
			}

			const modalContent = query('#zuck-modal-content');

			const moveStoryItem = function (direction) {
				const modalContainer = query('#zuck-modal');

				googletag.pubads().clear()

				let target = '';
				let useless = '';
				let transform = 0;

				const modalSlider = query(`#zuck-modal-slider-${id}`);
				const slideItems = {
					previous: query('#zuck-modal .story-viewer.previous'),
					next: query('#zuck-modal .story-viewer.next'),
					viewing: query('#zuck-modal .story-viewer.viewing')
				};

				if (
					(!slideItems['previous'] && !direction) ||
					(!slideItems['next'] && direction)
				) {
					return false;
				}

				if (!direction) {
					target = 'previous';
					useless = 'next';
				} else {
					target = 'next';
					useless = 'previous';
				}

				const transitionTime = 600;
				if (option('cubeEffect')) {
					if (target === 'previous') {
						transform = modalContainer.slideWidth;
					} else if (target === 'next') {
						transform = modalContainer.slideWidth * -1;
					}
				} else {
					transform = findPos(slideItems[target])[0] * -1;
				}

				translate(modalSlider, transform, transitionTime, null);

				setTimeout(() => {
					if (target !== '' && slideItems[target] && useless !== '') {
						const currentStory = slideItems[target].getAttribute('data-story-id');
						zuck.internalData['currentStory'] = currentStory;

						const oldStory = query(`#zuck-modal .story-viewer.${useless}`);

						if (oldStory) {
							const uselessStoryId = oldStory.getAttribute('data-story-id');
							const uselessStoryItems = zuck.data[uselessStoryId].items;
							
							each(uselessStoryItems, (i, item) => {
								if (item.type == 'video' && item.videoType == 'mpd') {
									if (item.mpdPlayer) {
										item.mpdPlayer.destroy();
									}
									item.destroyed = true;
								} else if (item.type == 'ads') {
									item.destroyed = googletag.destroySlots([item.adsSlot]);
								}
							});

							oldStory.parentNode.removeChild(oldStory);
						}

						if (slideItems['viewing']) {
							slideItems['viewing'].classList.add('stopped');
							slideItems['viewing'].classList.add(useless);
							slideItems['viewing'].classList.remove('viewing');
						}

						if (slideItems[target]) {
							slideItems[target].classList.remove('stopped');
							slideItems[target].classList.remove(target);
							slideItems[target].classList.add('viewing');
						}

						const newStoryData = getStoryMorningGlory(target);
						if (newStoryData) {
							createStoryViewer(newStoryData, target);
						}

						const storyId = zuck.internalData['currentStory'];
						let items = query(`#zuck-modal [data-story-id="${storyId}"]`);

						if (items) {
							items = items.querySelectorAll('[data-index].active');
							const duration = items[0].firstElementChild;
							zuck.data[storyId]['currentItem'] = parseInt(
								items[0].getAttribute('data-index'),
								10
							);

							const titleElms = document.getElementsByClassName('story-item-title');
							for (let i = 0; i < titleElms.length; i++) {
								titleElms[i].innerText = zuck.data[storyId].items[zuck.data[storyId]['currentItem']].title;
							}

							items[0].innerHTML =
								`<b style="${duration.style.cssText}"></b>`;
							onAnimationEnd(items[0].firstElementChild, () => {
								zuck.nextItem(false, true);
							});
						}

						translate(modalSlider, '0', 0, null);

						if (items) {
							const storyViewer = query(`#zuck-modal .story-viewer[data-story-id="${currentStory}"]`);
							playVideoItem(storyViewer, [items[0], items[1]], true);
						}

						const storyName = zuck.data[storyId].name;
						if (!storyName.includes('ads')) {
							createStoryTouchEvents(modalSlider);
						} else {
							createStoryViewerAds(currentStory, zuck.data[currentStory].items);
						}

						option('callbacks', 'onView')(zuck.internalData['currentStory']);
					}
				}, transitionTime + 50);
			};

			const createStoryViewer = function (storyData, className, forcePlay) {
				let modalSlider = query(`#zuck-modal-slider-${id}`);
				if (!modalSlider) {
					modalContent.innerHTML = `<div id="zuck-modal-slider-${id}" class="slider"></div>`;
				}
				modalSlider = query(`#zuck-modal-slider-${id}`);

				const storyItems = get(storyData, 'items');
				storyData.timeAgo = storyItems && storyItems[0] ? timeAgo(get(storyItems[0], 'time')) : '';

				let htmlItems = '';
				let pointerItems = '';

				const storyId = get(storyData, 'id');
				const isStoryAds = get(storyData, 'name').includes('ads');
				const slides = document.createElement('div');
				const currentItem = get(storyData, 'currentItem') || 0;
				const exists = query(`#zuck-modal .story-viewer[data-story-id="${storyId}"]`);

				let currentItemTime = '';

				if (exists) {
					return false;
				}

				slides.className = 'slides';
				each(storyItems, (i, item) => {
					item.timeAgo = timeAgo(get(item, 'time'));

					if (currentItem > i) {
						storyData['items'][i]['timeAgo'] = item.timeAgo;
						storyData['items'][i]['seen'] = true;
						item['seen'] = true;
					}

					if (currentItem === i) {
						currentItemTime = item.timeAgo;
					}

					if (item.videoType == 'mpd') {
						item['tagClass'] = `story-${storyId}-item-${i}`
					}

					pointerItems += option('template', 'viewerItemPointer')(i, currentItem, item);
					htmlItems += option('template', 'viewerItemBody')(i, currentItem, item);
					
				});

				slides.innerHTML = htmlItems;

				each(storyItems, (i, item) => {
					if (item.type != 'ads') {
						if (item.videoType == 'mpd') {
							item['mpdPlayer'] = dashjs.MediaPlayerFactory.create(slides.querySelector(`.${get(item, 'tagClass')}`));
							item['destroyed'] = false;
						}
					} else if (item.type == 'ads') {
						item['contentType'] = 'none';
					}
				});

				if (!isStoryAds) {
					const video = slides.querySelector('video');
					if (video) {
						const item = storyData.items[currentItem];

						const addMuted = function (video) {
							const muted = item.videoType == 'mpd' ? video.isMuted() : video.muted;
							if (muted) {
								storyViewer.classList.add('muted');
							} else {
								storyViewer.classList.remove('muted');
							}
						};

						if (item.videoType != 'mpd') {
							video.onwaiting = e => {
								if (video.paused) {
									storyViewer.classList.add('paused');
									storyViewer.classList.add('loading');
								}
							};

							video.onplay = () => {
								addMuted(video);

								storyViewer.classList.remove('stopped');
								storyViewer.classList.remove('paused');
								storyViewer.classList.remove('loading');
							};

							video.onload = video.onplaying = video.oncanplay = () => {
								addMuted(video);

								storyViewer.classList.remove('loading');
							};

							video.onvolumechange = () => {
								addMuted(video);
							};
						} else {
							item.mpdPlayer.preload();

							item.mpdPlayer.on('playbackWaiting', () => {
								if (item.mpdPlayer.isPaused()) {
									storyViewer.classList.add('paused');
									storyViewer.classList.add('loading');
								}
							});

							item.mpdPlayer.getVideoElement().onplay = () => {
								addMuted(item.mpdPlayer);

								storyViewer.classList.remove('stopped');
								storyViewer.classList.remove('paused');
								storyViewer.classList.remove('loading');
							}

							item.mpdPlayer.on('playbackPlaying', () => {
								addMuted(item.mpdPlayer);
								storyViewer.classList.remove('loading');
							});

							item.mpdPlayer.on('canPlay', () => {
								addMuted(item.mpdPlayer);
								storyViewer.classList.remove('loading');
							});

							item.mpdPlayer.getVideoElement().onvolumechange = () => {
								addMuted(item.mpdPlayer);
							}
						}
					}
				}

				let storyViewerWrap = document.createElement('div');
				storyViewerWrap.innerHTML = option('template', 'viewerItem')(storyData, currentItem);

				let storyViewer = storyViewerWrap.firstElementChild;
				storyViewer.className = `story-viewer muted ${className} ${!forcePlay ? 'stopped' : ''} ${option('backButton') ? 'with-back-button' : 'with-close-button'}`;

				storyViewer.setAttribute('data-story-id', storyId);
				storyViewer.querySelector('.slides-pointers .wrap').innerHTML = pointerItems;

				each(storyViewer.querySelectorAll('.close, .back'), (i, el) => {
					el.onclick = e => {
						e.preventDefault();
						const currentItem = storyData.currentItem || 0;
						const item = storyData.items[currentItem];
						homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_close_button_clicked');
						modal.close();
					};
				});

				storyViewer.appendChild(slides);

				if (className === 'viewing') {
					const item = zuck.data[storyId].items[currentItem];
					homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_view');
					playVideoItem(storyViewer, storyViewer.querySelectorAll(`[data-index="${currentItem}"].active`), false);
				}

				each(storyViewer.querySelectorAll('.slides-pointers [data-index] > b'), (i, el) => {
					onAnimationEnd(el, () => {
						zuck.nextItem(false, true);
					});
				});

				if (className === 'previous') {
					prepend(modalSlider, storyViewer);
				} else {
					modalSlider.appendChild(storyViewer);
				}

				// if (parent.firstChild) {
				// 	parent.insertBefore(child, parent.firstChild);
				// } else {
				// 	parent.appendChild(child);
				// }

				if (forcePlay) {
					const titleElms = document.getElementsByClassName('story-item-title');
					for (let i = 0; i < titleElms.length; i++) {
						titleElms[i].innerText = storyItems[currentItem].title;
					}
				}
				
				if (!isStoryAds) {
					let linkElement = storyViewer.querySelector('.slides a[target="_parent"]');
					if (linkElement) {
						linkElement.onclick = function() {
							const currentItem = storyData.currentItem || 0;
							const item = storyData.items[currentItem];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_click_here', 'N/A'); // TODO: story ads type
						};
					}
				}

				// Story Ads
				setTimeout(() => {
					if (className === 'viewing') {
						const storyName = get(storyData, 'name');
						if (!storyName.includes('ads')) {
							createStoryTouchEvents(modalSlider);
						}
					}
				}, 150);

				/* if (isStoryAds) {
					if (className === 'viewing') {
						setTimeout(function compileAds() {
							if (document.querySelector('#' + storyItems[0].preview)) {
								createStoryViewerAds(storyId, storyItems);
							} else {
								setTimeout(compileAds, 100);
							}
						}, 100);
					}
				} */
			};

			// Story Ads
			const createStoryViewerAds = function (storyID, storyAdsItems) {
				window.googletag = window.googletag || {cmd: []}
				
				// Refresh the pubads service everytime ads are going to be displayed
				// Tell user currently viewing story items is loading
				googletag.pubads().refresh()
				const storyViewer = query("#zuck-modal .viewing")
				storyViewer.classList.add("loading")
				storyViewer.classList.add("initial") // this will stop animation of the progress bar

				storyAdsItems.forEach(item => {
					if (item.type !== "ads") return

					if (!item["adsSlot"]) {
						googletag.cmd.push(function() {
							item['adsSlot'] = googletag
								.defineSlot(item.src, ['fluid'], item.preview)
								.addService(googletag.pubads())
							
							// Set targetting ads for each story ads items
							// This process will be omitted when array is an empty array
							taData.forEach(({ name, value }) => {
								googletag.pubads().setTargeting(name, value)
							})

							googletag.pubads().enableSingleRequest();
							googletag.pubads().collapseEmptyDivs();
							googletag.enableServices();
						});
					}

					googletag.pubads().addEventListener('slotOnload', () => {
						const parentElement = document.querySelector('.slides');
						const adsFrame = document.querySelector(`#${item.preview} > div > iframe`)
						adsFrame.style.height = parentElement.offsetHeight + 'px'

						const msg = {
							state: 'init',
							storyId: storyID,
							itemId: item.id
						}

						adsFrame.contentWindow.postMessage(JSON.stringify(msg), '*')
					})

					googletag.display(item.preview)

					item['destroyed'] = false;
				})
			}

			const createStoryTouchEvents = function (modalSliderElement) {
				const modalContainer = query('#zuck-modal');
				const enableMouseEvents = true;

				const modalSlider = modalSliderElement;
				const touchElement = query(`#zuck-modal .story-viewer[data-story-id="${zuck.internalData['currentStory']}"]`);

				let position = {};
				let touchOffset = void 0;
				let isScrolling = void 0;
				let delta = void 0;
				let timer = void 0;
				let nextTimer = void 0;

				let touchStart = function (event) {
					const storyViewer = query('#zuck-modal .viewing');
					
					if (event.target.nodeName === 'A') {
						return;
					}

					const touches = event.touches ? event.touches[0] : event;
					const pos = findPos(query('#zuck-modal .story-viewer.viewing'));

					modalContainer.slideWidth = query('#zuck-modal .story-viewer').offsetWidth;
					modalContainer.slideHeight = query('#zuck-modal .story-viewer').offsetHeight;

					position = {
						x: pos[0],
						y: pos[1]
					};

					// touch coordinates
					// const pageX = touches.pageX;
					// const pageY = touches.pageY;
					const pageX = touches.clientX;
					const pageY = touches.clientY;

					touchOffset = {
						x: pageX,
						y: pageY,
						time: Date.now(),
						valid: true
					};

					if (pageY < 80 || pageY > (modalContainer.slideHeight - 80)) {
						touchOffset.valid = false;
						return;
					} else {
						event.preventDefault();

						isScrolling = undefined;
						delta = {};

						if (enableMouseEvents) {
							/* modalSlider.addEventListener('mousemove', touchMove);
							modalSlider.addEventListener('mouseup', touchEnd);
							modalSlider.addEventListener('mouseleave', touchEnd); */
							touchElement.addEventListener('mousemove', touchMove);
							touchElement.addEventListener('mouseup', touchEnd);
							touchElement.addEventListener('mouseleave', touchEnd);
						}
						/* modalSlider.addEventListener('touchmove', touchMove);
						modalSlider.addEventListener('touchend', touchEnd); */
						touchElement.addEventListener('touchmove', touchMove);
						touchElement.addEventListener('touchend', touchEnd);

						if (storyViewer) {
							storyViewer.classList.add('paused');
						}

						pauseVideoItem();

						timer = setTimeout(() => {
							storyViewer.classList.add('longPress');
						}, 600);

						nextTimer = setTimeout(() => {
							clearInterval(nextTimer);
							nextTimer = false;
						}, 250);
					}
				};

				let touchMove = function (event) {
					const touches = event.touches ? event.touches[0] : event;
					const pageX = touches.pageX;
					const pageY = touches.pageY;

					if (touchOffset && touchOffset.valid) {
						delta = {
							x: pageX - touchOffset.x,
							y: pageY - touchOffset.y
						};

						if (typeof isScrolling === 'undefined') {
							isScrolling = !!(
								isScrolling || Math.abs(delta.x) < Math.abs(delta.y)
							);
						}

						if (!isScrolling && touchOffset) {
							event.preventDefault();

							translate(modalSlider, position.x + delta.x, 0, null);
						}
					}
				};

				let touchEnd = function (event) {
					const storyViewer = query('#zuck-modal .viewing');
					const lastTouchOffset = touchOffset;

					if (touchOffset && !touchOffset.valid) {
						return;
					} else {

						if (delta) {
							const duration = touchOffset ? Date.now() - touchOffset.time : undefined;
							const isValid = (Number(duration) < 300 && Math.abs(delta.x) > 25) || Math.abs(delta.x) > modalContainer.slideWidth / 3;
							const direction = delta.x < 0;

							const index = direction ? query('#zuck-modal .story-viewer.next') : query('#zuck-modal .story-viewer.previous');
							const isOutOfBounds = (direction && !index) || (!direction && !index);

							if (!isScrolling) {
								if (isValid && !isOutOfBounds) {
									const storyId = index.getAttribute('data-story-id');
									const storyData = zuck.data[storyId];
									const currentItem = storyData.currentItem || 0;
									const item = storyData.items[currentItem];
									if (
										lastTouchOffset.x > window.screen.width / 3 ||
										!option('previousTap')
									) {
										homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_swipe_next');
									}
									else {
										homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_swipe_previous');
									}
									moveStoryItem(direction);
								} else {

									if (!index) {
										if (query('#zuck-modal .story-viewer.next')) {
											translate(modalSlider, position.x, 300);
										}
										else {
											const totalItems = zuck.data[zuck.internalData['currentStory']].items.length - 1;
											const currentItem = zuck.data[zuck.internalData['currentStory']]['currentItem'];
											
											if (parseInt(currentItem) < parseInt(totalItems)) {
												translate(modalSlider, position.x, 300);
											} else {
												modal.close();
											}
										}
										
									}
									else {
										translate(modalSlider, position.x, 300);
									}
									
								}
							}

							touchOffset = undefined;

							if (enableMouseEvents) {
								/* modalSlider.removeEventListener('mousemove', touchMove);
								modalSlider.removeEventListener('mouseup', touchEnd);
								modalSlider.removeEventListener('mouseleave', touchEnd); */
								touchElement.removeEventListener('mousemove', touchMove);
								touchElement.removeEventListener('mouseup', touchEnd);
								touchElement.removeEventListener('mouseleave', touchEnd);
							}
							/* modalSlider.removeEventListener('touchmove', touchMove);
							modalSlider.removeEventListener('touchend', touchEnd); */
							touchElement.removeEventListener('touchmove', touchMove);
							touchElement.removeEventListener('touchend', touchEnd);
						}

						const video = zuck.internalData['currentVideoElement'];

						if (timer) {
							clearInterval(timer);
						}

						if (storyViewer) {
							playVideoItem(storyViewer, storyViewer.querySelectorAll('.active'), false);

							storyViewer.classList.remove('longPress');
							storyViewer.classList.remove('paused');
						}

						if (nextTimer) {
							clearInterval(nextTimer);
							nextTimer = false;

							const navigateItem = function () {
								if (
									lastTouchOffset.x > window.screen.width / 4 ||
									!option('previousTap')
								) {
									zuck.navigateItem('next', event);
								} else {
									zuck.navigateItem('previous', event);
								}
							};

							const storyViewerViewing = query('#zuck-modal .viewing');
							const adsItem = zuck.data[zuck.internalData['currentStory']].items[zuck.data[zuck.internalData['currentStory']]['currentItem']];

							if (storyViewerViewing && video) {
								if (storyViewerViewing.classList.contains('muted')) {
									unmuteVideoItem(video, storyViewerViewing);
								} else {
									navigateItem();
								}
							} else if (storyViewerViewing && adsItem.type == 'ads' && adsItem.contentType == 'video') {
								const adsFrame = document.querySelector(`#${adsItem.preview} > div > iframe`);

								if (adsFrame) {
									if (storyViewerViewing.classList.contains('muted')) {
										const msg = {
											state: 'unmute'
										}
										
										adsFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
									} else {
										navigateItem();
									}
								} else {
									navigateItem();
								}
							} else {
								navigateItem();

								return false;
							}
						}
					}
				};

				//modalSlider.addEventListener('touchstart', touchStart);
				touchElement.addEventListener('touchstart', touchStart);
				if (enableMouseEvents) {
					//modalSlider.addEventListener('mousedown', touchStart);
					touchElement.addEventListener('mousedown', touchStart);
				}
			};

			return {
				show(storyId, page) {
					// const storyData = zuck.data[storyId];
					// const currentItem = storyData['currentItem'] || 0;
					// const item = storyData.items[currentItem];
					// homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_clicked');

					const modalContainer = query('#zuck-modal');
					const callback = function () {
						modalContent.innerHTML = `<div id="zuck-modal-slider-${id}" class="slider"></div>`;
						const storyData = zuck.data[storyId];
						const currentItem = storyData['currentItem'] || 0;
						const modalSlider = query(`#zuck-modal-slider-${id}`);
						//createStoryTouchEvents(modalSlider);

						zuck.internalData['currentStory'] = storyId;
						storyData['currentItem'] = currentItem;

						if (option('backNative')) {
							window.location.hash = `#!${id}`;
						}

						const previousItemData = getStoryMorningGlory('previous');
						if (previousItemData) {
							createStoryViewer(previousItemData, 'previous');
						}

						if (storyData.currentItem != undefined && storyData.items[storyData.currentItem]) {
							const item = storyData.items[storyData.currentItem];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_clicked');
						}
						createStoryViewer(storyData, 'viewing', true);

						const nextItemData = getStoryMorningGlory('next');
						if (nextItemData) {
							createStoryViewer(nextItemData, 'next');
						}

						if (option('autoFullScreen')) {
							modalContainer.classList.add('fullscreen');
						}

						const tryFullScreen = function () {
							if (
								modalContainer.classList.contains('fullscreen') &&
								option('autoFullScreen') &&
								window.screen.width <= 1024
							) {
								fullScreen(modalContainer);
							}

							modalContainer.focus();
						};

						if (option('openEffect')) {
							const storyEl = query(
								`#${id} [data-id="${storyId}"] .item-preview`
							);
							const pos = findPos(storyEl);

							modalContainer.style.marginLeft = `${pos[0] + storyEl.offsetWidth / 2}px`;
							modalContainer.style.marginTop = `${pos[1] + storyEl.offsetHeight / 2}px`;
							modalContainer.style.display = 'block';

							modalContainer.slideWidth = query('#zuck-modal .story-viewer').offsetWidth;

							setTimeout(() => {
								modalContainer.classList.add('animated');
							}, 10);

							setTimeout(() => {
								tryFullScreen();
							}, 300); // because effects
						} else {
							modalContainer.style.display = 'block';
							modalContainer.slideWidth = query('#zuck-modal .story-viewer').offsetWidth;

							tryFullScreen();
						}

						option('callbacks', 'onView')(storyId);
					};

					option('callbacks', 'onOpen')(storyId, callback);
				},
				previous(unmute) {
					const callback = function () {
						const lastStory = zuck.internalData['currentStory'];
						const lastStoryTimelineElement = query(
							`#${id} [data-id="${lastStory}"]`
						);

						if (lastStoryTimelineElement) {
							lastStoryTimelineElement.classList.add('seen');

							zuck.data[lastStory]['seen'] = true;
							zuck.internalData['seenItems'][lastStory] = true;

							saveLocalData('seenItems', zuck.internalData['seenItems']);
							updateStorySeenPosition();
						}

						const stories = query('#zuck-modal .story-viewer.previous');
						if (!stories) {
							modal.close();
						} else {
							moveStoryItem(false);
						}
					};

					option('callbacks', 'onEnd')(
						zuck.internalData['currentStory'],
						callback
					);
				},
				next(unmute) {
					const callback = function () {
						const lastStory = zuck.internalData['currentStory'];
						const lastStoryTimelineElement = query(
							`#${id} [data-id="${lastStory}"]`
						);

						if (lastStoryTimelineElement) {
							lastStoryTimelineElement.classList.add('seen');

							zuck.data[lastStory]['seen'] = true;
							zuck.internalData['seenItems'][lastStory] = true;

							saveLocalData('seenItems', zuck.internalData['seenItems']);
							updateStorySeenPosition();
						}

						const stories = query('#zuck-modal .story-viewer.next');
						if (!stories) {
							modal.close();
						} else {
							moveStoryItem(true);
						}
					};

					option('callbacks', 'onEnd')(
						zuck.internalData['currentStory'],
						callback
					);
				},
				close() {
					const modalContainer = query('#zuck-modal');

					// destroy all
					const items = zuck.data[zuck.internalData['currentStory']].items;
					each(items, (i, item) => {
						if (item.type == 'video' && item.videoType == 'mpd') {
							if (item.mpdPlayer) {
								item.mpdPlayer.destroy();
							}
						}
						googletag.pubads().clear()
						item.destroyed = true;
					})

					const callback = function () {
						if (option('backNative')) {
							window.location.hash = '';
						}

						fullScreen(modalContainer, true);

						if (option('openEffect')) {
							modalContainer.classList.add('closed');
						} else {
							modalContent.innerHTML = '';
							modalContainer.style.display = 'none';
						}
					};

					option('callbacks', 'onClose')(zuck.internalData['currentStory'], callback);
				}
			};
		};

		let modal = ZuckModal();

		/* parse functions */
		const parseItems = function (story, forceUpdate) {
			const storyId = story.getAttribute('data-id');
			const storyItems = document.querySelectorAll(`#${id} [data-id="${storyId}"] .items > li`);
			const items = [];

			if (!option('reactive') || forceUpdate) {
				each(storyItems, (i, { firstElementChild }) => {
					const a = firstElementChild;
					const img = a.firstElementChild;
					items.push({
						id: a.getAttribute('data-id'),
						src: a.getAttribute('href'),
						length: a.getAttribute('data-length'),
						type: a.getAttribute('data-type'),
						time: a.getAttribute('data-time'),
						link: a.getAttribute('data-link'),
						linkText: a.getAttribute('data-linkText'),
						preview: img.getAttribute('src')
					});
				});

				zuck.data[storyId].items = items;

				let callback = option('callbacks', 'onDataUpdate');
				if (callback) {
					callback(zuck.data, () => { });
				}
			}
		};

		const parseStory = function (story, returnCallback) {
			const storyId = story.getAttribute('data-id');
			
			let seen = false;
			if (zuck.internalData['seenItems'][storyId]) {
				seen = true;
			}

			/*
			REACT
			if (seen) {
			  story.classList.add('seen');
			} else {
			  story.classList.remove('seen');
			}
			*/

			try {
				if (!zuck.data[storyId]) {
					zuck.data[storyId] = {};
				}

				zuck.data[storyId].id = storyId; // story id
				zuck.data[storyId].photo = story.getAttribute('data-photo'); // story preview (or user photo)
				zuck.data[storyId].name = story.querySelector('.name').innerText;
				zuck.data[storyId].link = story.querySelector('.item-link').getAttribute('href');
				zuck.data[storyId].lastUpdated = story.getAttribute('data-last-updated');
				zuck.data[storyId].seen = seen;

				if (!zuck.data[storyId].items) {
					zuck.data[storyId].items = [];
					zuck.data[storyId].noItems = true;
				}
			} catch (e) {
				zuck.data[storyId] = {
					items: []
				};
			}

			story.onclick = e => {
				e.preventDefault();
				modal.show(storyId);
			};

			let callback = option('callbacks', 'onDataUpdate');
			if (callback) {
				callback(zuck.data, () => { });
			}
		};

		// BIBLICAL
		const getStoryMorningGlory = function (what) {
			// my wife told me to stop singing Wonderwall. I SAID MAYBE.

			const currentStory = zuck.internalData['currentStory'];
			const whatElementYouMean = `${what}ElementSibling`;

			if (currentStory) {
				const foundStory = query(`#${id} [data-id="${currentStory}"]`)[whatElementYouMean];

				if (foundStory) {
					const storyId = foundStory.getAttribute('data-id');
					const data = zuck.data[storyId] || false;

					return data;
				}
			}

			return false;
		};

		const updateStorySeenPosition = function () {
			each(document.querySelectorAll(`#${id} .story.seen`), (i, el) => {
				const newData = zuck.data[el.getAttribute('data-id')];
				const timeline = el.parentNode;

				if (!option('reactive')) {
					timeline.removeChild(el);
				}
				zuck.update(newData, true);
			});
		};

		const playVideoItem = function (storyViewer, elements, unmute) {
			const itemElement = elements[1];
			const itemPointer = elements[0];

			if (!itemElement || !itemPointer) {
				return false;
			}

			const cur = zuck.internalData['currentVideoElement'];
			if (cur) {
				cur.pause();
			}

			if (itemElement.getAttribute('data-type') === 'video') {
				const videoTag = itemElement.getElementsByTagName('video')[0];
				if (!videoTag) {
					zuck.internalData['currentVideoElement'] = false;

					return false;
				}

				const itemHeader = query(`#zuck-modal .story-viewer[data-story-id="${zuck.internalData['currentStory']}"] > .head`);
				if (itemHeader && itemHeader.classList.contains('story-ads-content')) {
					itemHeader.classList.remove('story-ads-content');
				}

				let storyId = -1;
				let itemId = -1;

				if (videoTag.classList.length > 1) {
					const classStrings = videoTag.classList[1].split('-');
					storyId = parseInt(classStrings[1]);
					itemId = parseInt(classStrings[3]);
				}

				const video = videoTag.classList.length > 1 ? zuck.data[storyId].items[itemId].mpdPlayer : videoTag;

				const setDuration = function () {
					const duration = videoTag.classList.length > 1 ? video.duration() : video.duration
					if (duration) {
						setVendorVariable(
							itemPointer.getElementsByTagName('b')[0].style,
							'AnimationDuration',
							`${duration}s`
						);
					}
				};

				setDuration();
				if (videoTag.classList.length > 1) {
					video.on('playbackMetaDataLoaded', setDuration);
				} else {
					video.addEventListener('loadedmetadata', setDuration);
				}
				zuck.internalData['currentVideoElement'] = video;

				const isPlaying = videoTag.classList.length > 1 ? video.time() > 0 && !video.isPaused() && !video.getVideoElement().ended && video.isReady() : video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;

				if (!isPlaying) {
					video.play();
				}

				unmuteVideoItem(video, storyViewer);
				if (unmute && unmute.target) {
					unmuteVideoItem(video, storyViewer);
				}
			} else {
				zuck.internalData['currentVideoElement'] = false;

				const currentStory = zuck.internalData['currentStory'];
				const currentItem = zuck.data[currentStory]['currentItem'];
				const adsItem = zuck.data[currentStory].items[currentItem];

				if (adsItem.type == 'ads') {
					const itemHeader = query(`#zuck-modal .story-viewer[data-story-id="${currentStory}"] > .head`);
					if (itemHeader && !itemHeader.classList.contains('story-ads-content')) {
						itemHeader.classList.add('story-ads-content');
					}

					// ads with video type
					setTimeout(function checkVideoReady() {
						if (adsItem.contentType == 'video') {
							const adsFrame = document.querySelector(`#${adsItem.preview} > div > iframe`);
							if (adsFrame) {
								const msg = {
									state: 'play'
								};
	
								adsFrame.contentWindow.postMessage(JSON.stringify(msg), '*');
							}
						} else if (adsItem.contentType == 'none') {
							setTimeout(checkVideoReady, 300)
						}
					}, 300)
				} else {
					const itemHeader = query(`#zuck-modal .story-viewer[data-story-id="${currentStory}"] > .head`);
					if (itemHeader && itemHeader.classList.contains('story-ads-content')) {
						itemHeader.classList.remove('story-ads-content');
					}
				}
			}
		};

		const pauseVideoItem = function () {
			const video = zuck.internalData['currentVideoElement'];
			if (video) {
				try {
					video.pause();
				} catch (e) { }
			} else {
				const currentStory = zuck.internalData['currentStory'];
				const currentItem = zuck.data[currentStory]['currentItem'];
				const adsItem = zuck.data[currentStory].items[currentItem];

				if (adsItem.type == 'ads' && adsItem.contentType == 'video') {
					const adsFrame = document.querySelector(`#${adsItem.preview} > div > iframe`);

					const msg = {
						state: 'pause'
					}

					adsFrame.contentWindow.postMessage(JSON.stringify(msg), '*')
				}
			}
		};

		const unmuteVideoItem = function (video, storyViewer) {
			const isMPD = video.src == undefined ? true : false;
			if (isMPD) {
				video.setMute(false)
				video.setVolume(1.0);
				video.getVideoElement().removeAttribute('muted');
				let isPlaying = video.time() > 0 && !video.isPaused() && !video.getVideoElement().ended && video.isReady();
	
				if (!isPlaying) {
					video.play();
				}
	
				if (video.isPaused()) {
					video.setMute(true);
					isPlaying = video.time() > 0 && !video.isPaused() && !video.getVideoElement().ended && video.isReady()
					if (!isPlaying) {
						video.play();
					}
				}
			} else {
				video.muted = false;
				video.volume = 1.0;
				video.removeAttribute('muted');
				let isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
	
				if (!isPlaying) {
					video.play();
				}
	
				if (video.paused) {
					video.muted = true;
					isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
					if (!isPlaying) {
						video.play();
					}
				}
			}

			if (storyViewer) {
				storyViewer.classList.remove('paused');
			}
		};

		/* data functions */
		const saveLocalData = function (key, data) {
			try {
				if (option('localStorage')) {
					const keyName = `zuck-${id}-${key}`;

					window.localStorage[keyName] = JSON.stringify(data);
				}
			} catch (e) { }
		};

		const getLocalData = function (key) {
			if (option('localStorage')) {
				const keyName = `zuck-${id}-${key}`;

				return window.localStorage[keyName]
					? JSON.parse(window.localStorage[keyName])
					: false;
			} else {
				return false;
			}
		};

		/* api */
		zuck.data = option('stories') || {};
		zuck.internalData = {};
		zuck.internalData['seenItems'] = getLocalData('seenItems') || {};

		zuck.addStories = (datas, append) => {
			each(datas, (i, data) => {
				zuck.data.push(data);
			});

			if (timeline && timeline.querySelector('.story')) {
				each(timeline.querySelectorAll('.story'), (storyIndex, story) => {
					parseStory(story);
				});
			}

			if (!option('reactive')) {
				let seenItems = getLocalData('seenItems');

				for (let key in seenItems) {
					if (seenItems.hasOwnProperty(key)) {
						if (zuck.data[key]) {
							zuck.data[key].seen = seenItems[key];
						}
					}
				}
			}

			each(datas, (i, item) => {
				zuck.add(item, append);
			});

			updateStorySeenPosition();
		};

		zuck.add = zuck.update = (data, append) => {
			const storyId = get(data, 'id');
			const storyEl = query(`#${id} [data-id="${storyId}"]`);
			const items = get(data, 'items');

			let story = undefined;
			let preview = false;

			if (items[0]) {
				preview = items[0]['preview'] || '';
			}

			if (zuck.internalData['seenItems'][storyId] === true) {
				data.seen = true;
			}

			data.currentPreview = preview;

			if (!storyEl) {
				let storyItem = document.createElement('div');
				storyItem.innerHTML = option('template', 'timelineItem')(data);

				story = storyItem.firstElementChild;
			} else {
				story = storyEl;
			}

			if (data['seen'] === false) {
				zuck.internalData['seenItems'][storyId] = false;

				saveLocalData('seenItems', zuck.internalData['seenItems']);
			}

			story.setAttribute('data-id', storyId);
			story.setAttribute('data-photo', get(data, 'photo'));
			story.setAttribute('data-last-updated', get(data, 'lastUpdated'));

			parseStory(story);

			if (!storyEl && !option('reactive')) {
				if (append) {
					timeline.appendChild(story);
				} else {
					prepend(timeline, story);
				}
			}

			each(items, (i, item) => {
				zuck.addItem(storyId, item, append);
			});

			if (!append) {
				updateStorySeenPosition();
			}
		};

		zuck.next = () => {
			modal.next();
		};

		zuck.remove = (storyId) => {
			const story = query(`#${id} > [data-id="${storyId}"]`);

			story.parentNode.removeChild(story);
		};

		zuck.addItem = (storyId, data, append) => {
			const story = query(`#${id} > [data-id="${storyId}"]`);

			if (!option('reactive')) {
				const li = document.createElement('li');
				const el = story.querySelectorAll('.items')[0];

				li.className = get(data, 'seen') ? 'seen' : '';
				li.setAttribute('data-id', get(data, 'id'));

				// wow, too much jsx
				li.innerHTML = option('template', 'timelineStoryItem')(data);

				if (append) {
					el.appendChild(li);
				} else {
					prepend(el, li);
				}
			}

			parseItems(story);
		};

		zuck.removeItem = (storyId, itemId) => {
			const item = query(`#${id} > [data-id="${storyId}"] [data-id="${itemId}"]`);

			if (!option('reactive')) {
				timeline.parentNode.removeChild(item);
			}
		};

		zuck.navigateItem = zuck.nextItem = (direction, endDuration, event) => {
			if (endDuration && endDuration != true) {
				event = endDuration;
			}

			const currentStory = zuck.internalData['currentStory'];
			const currentItem = zuck.data[currentStory]['currentItem'];
			const storyViewer = query(`#zuck-modal .story-viewer[data-story-id="${currentStory}"]`);
			const directionNumber = direction === 'previous' ? -1 : 1;
			if (!storyViewer || storyViewer.touchMove === 1) {
				return false;
			}

			const currentItemElements = storyViewer.querySelectorAll(`[data-index="${currentItem}"]`);
			const currentPointer = currentItemElements[0];
			const currentItemElement = currentItemElements[1];
			
			const navigateItem = currentItem + directionNumber;
			const nextItems = storyViewer.querySelectorAll(`[data-index="${navigateItem}"]`);
			const nextPointer = nextItems[0];
			const nextItem = nextItems[1];

			if (storyViewer && nextPointer && nextItem) {
				// go to next/prev story item
				if (endDuration && endDuration != true) {
					let currentStoryIndex = Number(currentStory);
					let nextItemIndex = Number(nextItem.getAttribute('data-index'));
					if (direction !== 'previous') {
						if (currentStoryIndex < zuck.data.length && zuck.data[currentStoryIndex]) {
							const item = zuck.data[currentStoryIndex].items[nextItemIndex];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_click_next');
						}
					}
					else {
						if (currentStoryIndex >= 0 && zuck.data[currentStoryIndex]) {
							const item = zuck.data[currentStoryIndex].items[nextItemIndex];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_click_previous');
						}
					}
				}
				

				const navigateItemCallback = function () {
					if (direction === 'previous') {
						currentPointer.classList.remove('seen');
						currentItemElement.classList.remove('seen');
					} else {
						currentPointer.classList.add('seen');
						currentItemElement.classList.add('seen');
					}

					currentPointer.classList.remove('active');
					currentItemElement.classList.remove('active');

					nextPointer.classList.remove('seen');
					nextPointer.classList.add('active');

					nextItem.classList.remove('seen');
					nextItem.classList.add('active');

					zuck.data[currentStory]['currentItem'] = zuck.data[currentStory]['currentItem'] + directionNumber;

					const item = zuck.data[currentStory].items[zuck.data[currentStory].currentItem];
					homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_view');

					each(storyViewer.querySelectorAll('.time'), (i, el) => {
						el.innerText = timeAgo(nextItem.getAttribute('data-time'));
					});

					
					const titleElms = document.getElementsByClassName('story-item-title');
					for (let i = 0; i < titleElms.length; i++) {
						titleElms[i].innerText = zuck.data[currentStory].items[zuck.data[currentStory]['currentItem']].title;
					}

					playVideoItem(storyViewer, nextItems, event);
				};

				// const titleElms = document.getElementsByClassName('story-item-title');
				// for (let i = 0; i < titleElms.length; i++) {
				//   titleElms[i].innerText = zuck.data[currentStory].items[zuck.data[currentStory]['currentItem']].title;
				// }


				let callback = option('callbacks', 'onNavigateItem');
				callback = !callback ? option('callbacks', 'onNextItem') : option('callbacks', 'onNavigateItem');
				callback(currentStory, nextItem.getAttribute('data-story-id'), navigateItemCallback);
			} else if (storyViewer) {
				// go to next/prev story
				let currentStoryIndex = Number(currentStory);
				if (endDuration && endDuration != true) {
					
					if (direction !== 'previous') {
						if (currentStoryIndex + 1 < zuck.data.length && zuck.data[currentStoryIndex + 1]) {
							let item = zuck.data[currentStoryIndex + 1].items[0];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_click_next');
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_view');
						}
						modal.next(event);
					}
					else {
						if (currentStoryIndex - 1 >= 0 && zuck.data[currentStoryIndex - 1]) {
							const item = zuck.data[currentStoryIndex - 1].items[zuck.data[currentStoryIndex - 1].items.length - 1];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_click_previous');
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_view');
						}
						modal.previous(event);
					}
				}
				else {
					if (direction !== 'previous') {
						if (currentStoryIndex + 1 < zuck.data.length && zuck.data[currentStoryIndex + 1]) {
							let item = zuck.data[currentStoryIndex + 1].items[0];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_view');
						}
						modal.next(event);
					}
					else {
						if (currentStoryIndex - 1 >= 0 && zuck.data[currentStoryIndex - 1]) {
							let item = zuck.data[currentStoryIndex - 1].items[zuck.data[currentStoryIndex - 1].items.length - 1];
							homeStoryEvent(item.id, item.title, item.type, 'mweb_homepage_story_view');
						}
						modal.previous(event);
					}
				}
			}
			
			// refresh the state of the ads to prevent overlapping sounds between switching over ads story items
			// dont forget to add loading state to tell user it's still loading when it is going to display story ads
			googletag.pubads().refresh()
			if (zuck.data[currentStory].items.every(({ type }) => type === "ads")) {
				storyViewer.classList.add("loading")
				storyViewer.classList.add("initial") // this will stop animation of the progress bar
			}
		};

		const init = function () {
			if (timeline && timeline.querySelector('.story')) {
				each(timeline.querySelectorAll('.story'), (storyIndex, story) => {
					parseStory(story);
				});
			}

			if (option('backNative')) {
				if (window.location.hash === `#!${id}`) {
					window.location.hash = '';
				}

				window.addEventListener(
					'popstate',
					e => {
						if (window.location.hash !== `#!${id}`) {
							window.location.hash = '';
						}
					},
					false
				);
			}

			if (!option('reactive')) {
				let seenItems = getLocalData('seenItems');

				for (let key in seenItems) {
					if (seenItems.hasOwnProperty(key)) {
						if (zuck.data[key]) {
							zuck.data[key].seen = seenItems[key];
						}
					}
				}
			}

			each(option('stories'), (i, item) => {
				zuck.add(item, true);
			});

			updateStorySeenPosition();

			const avatars = option('avatars') ? 'user-icon' : 'story-preview';
			const list = option('list') ? 'list' : 'carousel';

			timeline.className += ` stories ${avatars} ${list} ${(`${option('skin')}`).toLowerCase()}`;

			return zuck;
		};

		return init();
	};


	/* Helpers */
	ZuckJS.buildTimelineItem = (id, photo, name, link, lastUpdated, items, taGpt) => {
		let timelineItem = {
			id,
			photo,
			name,
			link,
			lastUpdated,
			items: []
		};
		taData = taGpt


		each(items, (itemIndex, itemArgs) => {
			timelineItem.items.push(ZuckJS.buildStoryItem.apply(ZuckJS, itemArgs));
		});

		return timelineItem;
	};

	/**
	 * Deprecated for personal RCTI+ use case
	 */
	/* ZuckJS.buildStoryItem = (id, type, length, src, preview, link, linkText, seen, time, title) => {
		return {
			id,
			type,
			length,
			src,
			preview,
			link,
			linkText,
			seen,
			time,
			title
		};
	}; */
	ZuckJS.buildStoryItem = (id, type, length, src, preview, link, linkText, seen, time, title, videoType) => {
		return {
			id,
			type,
			length,
			src,
			preview,
			link,
			linkText,
			seen,
			time,
			title,
			videoType
		};
	};

	/* Legacy code */
	ZuckJS.buildItem = ZuckJS.buildStoryItem;

	// CommonJS and Node.js module support.
	if (typeof exports !== 'undefined') {
		// Support Node.js specific `module.exports` (which can be a function)
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = ZuckJS;
		}
		// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
		exports.ZuckJS = ZuckJS;
	} else {
		/* Too much zuck zuck to maintain legacy */
		window['ZuckitaDaGalera'] = window['Zuck'] = ZuckJS;
	}

	return ZuckJS;
})(window || {});