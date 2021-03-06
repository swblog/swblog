/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @file index 入口文件，路由定义
	 * @author ljquan@qq.com
	 */
	
	__webpack_require__(1);
	var m_article = __webpack_require__(4);
	var m_config = __webpack_require__(7);
	var c_header = __webpack_require__(8);
	var c_pageList = __webpack_require__(9);
	var c_pageBook = __webpack_require__(18);
	var c_pageContent = __webpack_require__(20);
	var c_pageBlog = __webpack_require__(22);
	var c_pageSearch = __webpack_require__(23);
	var viewHeader = c_header();
	$('body').append(viewHeader);
	
	m_config.getConfig.then(function () {
	  return m_article.initArticle.then(function () {
	    viewHeader.reset();
	    BCD.app({ //入口
	      setTitle: function setTitle(str) {
	        //viewHeader.reset();
	        var navLis = viewHeader.find('.nav li');
	        navLis.removeClass('active');
	        navLis.each(function (i, domLi) {
	          var url = $($(domLi).find('a')[0]).attr('data-url') || '';
	          if (location.hash.indexOf(url) === 0) {
	            $(domLi).addClass('active');
	          }
	        });
	        document.title = str;
	      },
	      initPage: function initPage(key, next) {
	        var page = this;
	        if (key == 'index') {
	          c_pageList(page, key);
	          next();
	        } else if (key == 'tag') {
	          c_pageList(page, key);
	          next();
	        } else if (key == 'blog') {
	          c_pageBlog(page);
	          next();
	        } else if (key == 'search') {
	          c_pageSearch(page, key);
	          next();
	        } else {
	          var path = decodeURIComponent(key);
	          if (m_article.hasBook(path)) {
	            c_pageBook(page, path);
	            return next();
	          } else if (m_article.hasCatalog(path)) {
	            c_pageList(page, path);
	            return next();
	          } else if (m_article.hasArticle(path)) {
	            c_pageContent(page, path);
	            return next();
	          }
	
	          BCD.replaceHash(m_config.getIndex());
	          next(-1);
	        }
	      }
	    });
	  });
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_util = __webpack_require__(2);
	//data-on="?m=go" data-url="<%=o.href%>"
	var go = function go(ele, option, data) {
	  ele.on('click', function (e) {
	    BCD.go(ele.data('url'));
	    m_util.stopBubble(e);
	  });
	};
	BCD.addCommand('go', go);
	//data-on="?m=back"
	var back = function back(ele, option, data) {
	  ele.on('click', function (e) {
	    history.back();
	    m_util.stopBubble(e);
	  });
	};
	BCD.addCommand('back', back);
	
	var replaceHash = function replaceHash(ele, option, data) {
	  ele.on('click', function (e) {
	    BCD.replaceHash(ele.data('url'));
	    m_util.stopBubble(e);
	  });
	};
	BCD.addCommand('replaceHash', replaceHash);
	//事件绑定
	module.exports = {
	  go: go,
	  back: back,
	  replaceHash: replaceHash
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_event = __webpack_require__(3);
	var getTime = function getTime(date) {
	  date = new Date(date);
	  var now = new Date();
	  var diff = now - date;
	  switch (true) {
	    case diff < 6E4:
	      return '刚刚';
	    case diff < 36E5:
	      return Math.round(diff / 6E4) + '分钟前';
	    case diff < 864E5:
	      return Math.round(diff / 36E5) + '小时前';
	    case diff < 1728E5 && now.getDate() - date.getDate() != 2:
	      return '昨天';
	    case date.getFullYear() === new Date().getFullYear():
	      return BCD.time.formatDate(date, "%M月%d日");
	    default:
	      return BCD.time.formatDate(date, "%y年%M月%d日");
	  }
	};
	
	var leftFillString = function leftFillString(num, length) {
	  return ("0000000000" + num).substr(-length);
	};
	var getRandomName = function getRandomName() {
	  return ("aaaaaaaaaa" + Math.random().toString(36).replace(/[.\d]/g, '')).substr(-10);
	};
	module.exports = {
	  getTime: getTime,
	  leftFillString: leftFillString,
	  getRandomName: getRandomName,
	  stopBubble: m_event.stopBubble,
	  stopBubbleEx: m_event.stopBubbleEx
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	
	/**
	 * @module {Object} event  事件相关的处理函数
	 * @return {object} 方法集合
	 * @property {function} stopBubble 停止冒泡并禁止默认事件
	 * @property {function} stopBubbleEx 停止冒泡
	 * @author ljquan@qq.com
	 */
	
	module.exports = {
	    /**
	     * 停止冒泡并禁止默认事件
	     * @param  {event} e 事件
	     * @return {null}
	     */
	    stopBubble: function stopBubble(e) {
	        if (e && e.stopPropagation) {
	            e.stopPropagation();
	        }
	        e.preventDefault();
	    },
	    /**
	     * 停止冒泡
	     * @param  {event} e 事件
	     * @return {null}
	     */
	    stopBubbleEx: function stopBubbleEx(e) {
	        if (e && e.stopPropagation) {
	            e.stopPropagation();
	        }
	    }
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var m_util = __webpack_require__(2);
	var m_search = __webpack_require__(5);
	var swPostMessage = __webpack_require__(6);
	var catalogList = []; //目录列表
	var catalogDict = {};
	var articleList = []; //文件列表
	var articleDict = {};
	var sidebarList = []; //sidebar文件列表(sidebar文件也可以在articleDict中索引到)
	var bookList = []; //书籍列表
	var bookDict = {};
	var tagList = [];
	var startTime = Date.now();
	var isPreload = false;
	var sidebarName = '$sidebar$';
	var getSidebarPath = function getSidebarPath(path) {
	  return path + '/' + sidebarName + '.md';
	};
	
	BCD.addCommand('mkview', function (ele, option, data) {
	  var name = m_util.getRandomName();
	  var result = void 0;
	  if ('idx' in option) {
	    var item = data.list[option.idx];
	    result = item.summary;
	    if (result.length < item.content.length) {
	      result += '...';
	    }
	  } else {
	    result = data.content;
	  }
	
	  ele.attr('id', name);
	  setTimeout(function () {
	    //dom元素展示出来之后再绑定，不然流程图等会有样式问题
	    editormd.markdownToHTML(name, {
	      markdown: result, //+ "\r\n" + $("#append-test").text(),
	      // htmlDecode: true, // 开启 HTML 标签解析，为了安全性，默认不开启
	      htmlDecode: "style,script,iframe", // you can filter tags decode
	      //toc             : false,
	      tocm: true, // Using [TOCM]
	      //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
	      //gfm             : false,
	      //tocDropdown     : true,
	      // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
	      emoji: true,
	      taskList: true,
	      tex: true, // 默认不解析
	      flowChart: true, // 默认不解析
	      sequenceDiagram: true // 默认不解析
	    });
	    if (result.indexOf('[TOC]') > -1 && location.hash.indexOf('.md') > 0) {
	      //兼容TOC目录
	      var baseHash = location.hash.replace(/\.md\/.*/, '.md');
	      $('#' + name).html($('#' + name).html().replace(/href="#([^"]*)/g, function ($0, $1) {
	        if ($1) {
	          return 'href="' + baseHash + '/' + $1;
	        }
	        return $0;
	      }).replace(/name="([^"]*)/g, function ($0, $1) {
	        if ($1) {
	          return 'name="' + baseHash.substr(1) + '/' + $1;
	        }
	        return $0;
	      }));
	    }
	    $('a[href^="http"]').attr('target', '_blank');
	  }, 0);
	});
	
	var getName = function getName(path) {
	  var arr = path.match(/\/([^/.]+)[.\w-_]+$/);
	  return arr ? arr[1] : '';
	};
	
	var getURL = function getURL(o) {
	  return '/' + o.path + '?mtime=' + o.mtime;
	};
	
	var getPath = function getPath(pathWithSearch) {
	  return decodeURIComponent(pathWithSearch.replace(location.origin + '/', '').replace(/\?[^?]+/, ''));
	};
	
	var getSortContent = function getSortContent(content) {
	  var paragraph = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
	
	  var len = 500;
	  var minLen = len / 2;
	  var ret = content.substring(0, len);
	  var partCount = 0;
	  var partIndex = 0;
	  ret.replace(/([^\n]*)(\n|<br>|<\/p>)/g, function ($0, $1, $2, idx) {
	    partCount++;
	    if (partCount > paragraph && $1.length > 10 && partIndex === 0) {
	      partIndex = idx;
	    }
	    if (partCount == 15 && partIndex === 0) {
	      partIndex = idx;
	    }
	  });
	  if (partIndex > 0) {
	    ret = ret.substring(0, partIndex);
	    if (ret.length < len * 0.7) {
	      return ret;
	    }
	  }
	  var getContent = function getContent(str, reg) {
	    var arr = str.split(reg).filter(function (o) {
	      return !!o;
	    });
	    var count = 0;
	    if (arr && arr.length > 2) {
	      var idx = arr.length - 1;
	      if (arr.some(function (o, i) {
	        count += o.length;
	        if (count > minLen && i > 1) {
	          idx = i;
	          return true;
	        }
	      })) {
	        return str.substr(0, str.lastIndexOf(arr[idx])).replace(/[#\s]+$/, '');
	      }
	      return str;
	    }
	  };
	  var con = getContent(ret, /\s*#+\s*/);
	  if (con) {
	    return con;
	  }
	  con = getContent(ret, /\s+/);
	  if (con) {
	    return con;
	  }
	  return ret;
	};
	
	var processItem = function processItem(item, content) {
	  if (item.title == sidebarName) {
	    item.content = content;
	    return item;
	  }
	  var isRaw = true;
	  // let start = content.indexOf('---');
	  // if(start>-1){
	  //   let end;
	  //   if(start===0){
	  //     start = start+3;
	  //     end = content.substring(start).indexOf('---') + start;
	  //   }else{
	  //     end = start;
	  //     start = 0;
	  //   }
	  //   let arr = content.substring(start, end).match(/([^:\n]+:[^\n]+)/g);
	  //   if(arr){
	  //     let attrDict = {};
	  //     arr.forEach(function(o){
	  //       let point = o.indexOf(':');
	  //       attrDict[o.substring(0, point)] = o.substring(point+1);
	  //     });
	  //     item.title = attrDict.title || item.title;
	  //     isRaw = false;
	  //     content = content.substring(end+3).trim();
	  //     if(attrDict.dest_url){
	  //       content = '链接：['+attrDict.dest_url+']('+attrDict.dest_url+')'
	  //     }
	  //   }
	  // }
	  if (isRaw) {
	    var arr = content.match(/^[\s]*#[^\n]+[\s]*/);
	    if (arr) {
	      var title = arr[0];
	      item.title = title.replace(/[#\s]+/, '').trim();
	      content = content.replace(title, '');
	      isRaw = false;
	    }
	  }
	
	  item.content = content = (content || '').replace(/^[\s]*---[-]*/, '');
	  item.tfList = m_search.getTFs(content);
	  item.summary = getSortContent(content);
	  return item;
	};
	
	var preload = function preload(obj) {
	  var count = 0;
	  for (var pathWithSearch in obj) {
	    var path = getPath(pathWithSearch);
	    var item = void 0;
	    if (item = articleDict[path]) {
	      count++;
	      processItem(item, obj[pathWithSearch]);
	    }
	  }
	  var totalList = sidebarList.concat(articleList);
	  var existDict = {};
	  totalList.forEach(function (o) {
	    existDict[location.origin + '/' + o.path] = 1;
	  });
	
	  swPostMessage({
	    m: 'delete_not_exist_article',
	    dict: existDict
	  });
	
	  if (isPreload) {
	    if (count) {
	      console.log('文章同步成功（' + count + '篇）！可以离线使用');
	    } else {
	      console.log('文章同步成功!（无更新内容）');
	    }
	    return false;
	  } else {
	    isPreload = true;
	    console.log('本地文章加载成功（' + count + '/' + (articleList.length + sidebarList.length) + '个文件）');
	  }
	  return true;
	};
	
	var init = function init(list) {
	  catalogList = []; //目录列表
	  articleList = []; //文件列表
	  sidebarList = [];
	  bookList = [];
	  var tagSet = new Set();
	  var processArticle = function processArticle(o) {
	    var _o$path = o.path,
	        path = _o$path === undefined ? '' : _o$path,
	        mtime = o.mtime;
	
	    if (o.isDirectory) {
	      var tags = path.split('/').slice(1);
	      tags.forEach(function (o) {
	        return tagSet.add(o);
	      });
	      var item = {
	        path: path,
	        time: m_util.getTime(mtime),
	        href: '#!/' + encodeURIComponent(o.path),
	        title: path.slice(path.lastIndexOf('/') + 1),
	        tagList: tags
	      };
	      catalogList.push(item);
	    } else {
	      var _tags = path.split('/').slice(1, -1);
	      _tags.forEach(function (o) {
	        return tagSet.add(o);
	      });
	      var _item = {
	        path: path,
	        mtime: mtime,
	        href: '#!/' + encodeURIComponent(o.path),
	        title: getName(path),
	        time: m_util.getTime(mtime),
	        tagList: _tags
	      };
	      if (articleDict[path]) {
	        _item = $.extend(articleDict[path], _item);
	      } else {
	        articleDict[path] = _item;
	      }
	      articleList.push(_item);
	    }
	  };
	  list.forEach(processArticle);
	  articleList = articleList.filter(function (o) {
	    if (o.title == sidebarName) {
	      sidebarList.push(o);
	      return false;
	    }
	    return true;
	  });
	  catalogList = catalogList.filter(function (o) {
	    if (articleDict[getSidebarPath(o.path)]) {
	      bookDict[o.path] = o;
	      bookList.push(o);
	      return false;
	    }
	    catalogDict[o.path] = o;
	    return true;
	  });
	  articleList = articleList.sort(function (a, b) {
	    return b.mtime - a.mtime;
	  });
	  tagList = [].concat(_toConsumableArray(tagSet));
	};
	
	var processCount = 0;
	//先用缓存，请求回来再更新
	var initArticle = new Promise(function (resolve) {
	  BCD.ajaxCache('./json/article.json', function (data) {
	    init(data);
	    processCount++;
	    if (processCount === 2) {
	      //如果网络请求失败，这里不会被执行
	      var totalList = sidebarList.concat(articleList);
	      swPostMessage({
	        m: 'preloadAtricle',
	        list: totalList.map(getURL)
	      }, preload);
	    }
	    resolve();
	    return 1; //缓存数据到localStorage
	  }, 0, 1E3, true);
	});
	
	//获取包含相关tag文章列表
	var getTagArticles = function getTagArticles(tag) {
	  if (tag) {
	    return articleList.filter(function (o) {
	      return o.tagList && o.tagList.indexOf(tag) > -1;
	    });
	  }
	  return articleList;
	};
	
	var fetchContent = function fetchContent(list) {
	  var ajaxList = list.filter(function (o) {
	    return articleDict[o.path] && !articleDict[o.path].content;
	  }).map(function (o) {
	    return $.ajax({
	      url: getURL(o),
	      success: function success(str) {
	        articleDict[o.path] = processItem(o, str);
	      }
	    });
	  });
	  return new Promise(function (resolve) {
	    $.when.apply(this, ajaxList).then(resolve, resolve);
	  });
	};
	
	var getList = function getList(method) {
	  return function (tag) {
	    var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
	
	    page = parseInt(page || 0);
	    var start = page * count;
	    var totalList = method(tag);
	    var list = totalList.slice(start, start + count);
	    return fetchContent(list).then(function () {
	      return {
	        tag: tag,
	        page: page,
	        count: count,
	        num: totalList.length,
	        list: list.map(function (o) {
	          return articleDict[o.path];
	        }).filter(function (o) {
	          return !!(o && o.content);
	        })
	      };
	    });
	  };
	};
	
	var getChildCatalog = function getChildCatalog(path) {
	  var catalog = catalogDict[path];
	  if (catalog) {
	    var _tagList = catalog.tagList;
	    var tagLength = _tagList.length + 1;
	    return bookList.concat(catalogList).filter(function (o) {
	      return o.tagList.length && _tagList.every(function (tag, i) {
	        return o.tagList.length == tagLength && tag == o.tagList[i];
	      });
	    });
	  }
	  return [];
	};
	
	var getCatalogArticles = function getCatalogArticles(path) {
	  var catalog = catalogDict[path];
	  if (catalog) {
	    var _tagList2 = catalog.tagList;
	    return articleList.filter(function (o) {
	      return o.tagList.length && _tagList2.every(function (tag, i) {
	        return tag == o.tagList[i];
	      });
	    }).sort(function (a, b) {
	      return a.tagList.length - b.tagList.length;
	    });
	  }
	  return [];
	};
	
	var testItem = function testItem(reg, item) {
	  var testType = 0;
	  var obj = {};
	  var searchWeight = 0;
	  var titleMatchDict = {};
	  var contentMatchDict = {};
	  if (reg.test(item.title)) {
	    obj.title = item.title.replace(reg, function ($0) {
	      if (titleMatchDict[$0]) {
	        titleMatchDict[$0]++;
	      } else {
	        titleMatchDict[$0] = 1;
	      }
	      return '<span class="text-danger">' + $0 + '</span>';
	    });
	    testType += 1;
	    var titleMathLength = 0;
	    for (var key in titleMatchDict) {
	      titleMathLength += /\w/.test(key) ? titleMatchDict[key] : Math.pow(1.6, key.length - 1) * titleMatchDict[key];
	    }
	    searchWeight += titleMathLength / item.title.length;
	  }
	  if (item.content && reg.test(item.content)) {
	    var pointList = [];
	    obj.content = item.content.replace(reg, function ($0, point) {
	      if (contentMatchDict[$0]) {
	        contentMatchDict[$0]++;
	      } else {
	        contentMatchDict[$0] = 1;
	      }
	      var weight = /\w/.test($0) ? 2 : $0.length;
	      pointList.push({
	        point: point,
	        weight: weight
	      });
	      return '<font color=#a94442>' + $0 + '</font>';
	    });
	    pointList = pointList.sort(function (a, b) {
	      return b.weight - a.weight;
	    });
	    var startPoint = pointList[0].point;
	    var start = startPoint - 30;
	    var summary = item.content.substr(start < 0 ? 0 : start);
	    start = summary.search(/[。\n\r]/);
	    if (start < startPoint) {
	      summary = getSortContent(summary.substr(start).replace(/^[。\s]*/, ''), 5);
	    } else {
	      summary = getSortContent(summary.replace(/^[。\s]*/, ''), 5);
	    }
	    obj.summary = summary.replace(reg, function ($0) {
	      return '<font color=#a94442>' + $0 + '</font>';
	    });
	    testType += 2;
	    var contentMathLength = 0;
	
	    for (var key in contentMatchDict) {
	      contentMathLength += /\w/.test(key) ? contentMatchDict[key] : Math.pow(1.6, key.length - 1) * contentMatchDict[key];
	    }
	    searchWeight += contentMathLength / Math.pow(item.content.length, 0.6);
	  }
	  obj.testType = testType;
	  /*******calculate search weight**********/
	
	  obj.searchWeight = searchWeight;
	  return Object.assign({}, item, obj);
	};
	
	var searchList = function searchList(word, callback) {
	  var isCommend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	  var reg = m_search.getGlobalRegex(word);
	  var fitList = [];
	  var remainList = [];
	  var ajaxList = [];
	  var totalList = articleList.filter(function (o) {
	    return o;
	  });
	
	  var searchCallback = function searchCallback(list) {
	    var resultList = list.filter(function (o) {
	      return o.testType > 0;
	    }).sort(function (a, b) {
	      var ret = b.searchWeight - a.searchWeight;
	      if (ret === 0) {
	        return b.content.length - a.content.length + (b.mtime - a.mtime) / 1E5;
	      }
	      return ret;
	    });
	    if (resultList.length || list.length >= totalList.length) {
	      console.table(resultList.map(function (o) {
	        return {
	          path: o.path,
	          searchWeight: o.searchWeight
	        };
	      }));
	    }
	    callback({
	      totalNum: totalList.length,
	      checkNum: list.length,
	      searchWord: word,
	      list: resultList
	    });
	  };
	  var batchProcess = function batchProcess(list, next) {
	    var subList = list.splice(0, 10);
	    fetchContent(subList).then(function () {
	      searchCallback(subList.map(function (o) {
	        return testItem(reg, articleDict[o.path]);
	      }));
	      if (list.length) {
	        batchProcess(list, next);
	      } else if (next) {
	        next();
	      }
	    });
	  };
	  totalList.forEach(function (o) {
	    var item = articleDict[o.path];
	    if (item) {
	      var testObj = testItem(reg, item);
	      if (item.content) {
	        fitList.push(testObj);
	      } else if (testObj.testType > 0) {
	        ajaxList.push(item);
	      } else {
	        remainList.push(o);
	      }
	    }
	  });
	  if (isCommend) {
	    return callback(ajaxList.concat(fitList).filter(function (o) {
	      return o.testType > 0;
	    }).sort(function (a, b) {
	      return b.searchWeight - a.searchWeight;
	    }));
	  }
	  searchCallback(fitList);
	  batchProcess(ajaxList, function () {
	    batchProcess(remainList);
	  });
	  return remainList;
	};
	
	//搜索直达
	var searchDirect = function searchDirect(word) {
	  var reg = m_search.getGlobalRegex(word);
	  return articleList.filter(function (o) {
	    return reg.test(o.title);
	  }).map(function (o) {
	    var weight = 0;
	    var item = {
	      href: o.href,
	      title: o.title.replace(reg, function ($0) {
	        weight += $0.length;
	        return '<span class="text-danger">' + $0 + '</span>';
	      })
	    };
	    item.weight = weight;
	    return item;
	  }).sort(function (a, b) {
	    return b.weight - a.weight;
	  });
	};
	
	module.exports = {
	  getName: getName,
	  isPreload: isPreload,
	  startTime: startTime,
	  initArticle: initArticle,
	  catalogDict: catalogDict,
	  articleDict: articleDict,
	  hasCatalog: function hasCatalog(path) {
	    return !!catalogDict[decodeURIComponent(path)];
	  },
	  hasArticle: function hasArticle(path) {
	    return !!articleDict[decodeURIComponent(path)];
	  },
	  hasBook: function hasBook(path) {
	    return !!bookDict[decodeURIComponent(path)];
	  },
	  getCatalogMessage: function getCatalogMessage(path) {
	    return catalogDict[decodeURIComponent(path)];
	  },
	  getCatalogs: function getCatalogs() {
	    return catalogList;
	  },
	  getBooks: function getBooks() {
	    return bookList;
	  },
	  getTagArticles: getTagArticles,
	  getTags: function getTags() {
	    return tagList;
	  },
	  getSidebarPath: getSidebarPath,
	  getArticleList: function getArticleList() {
	    return articleList.map(function (o) {
	      return articleDict[o.path];
	    });
	  },
	  getListByCatalog: getList(getCatalogArticles),
	  getChildCatalog: getChildCatalog,
	  getListByTag: getList(getTagArticles),
	  getArticleContent: function getArticleContent(path) {
	    return fetchContent([articleDict[path]]).then(function () {
	      return articleDict[path];
	    });
	  },
	  searchDirect: searchDirect,
	  searchList: searchList
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var createNGram = function createNGram(n) {
	  return function (str) {
	    var arr = [];
	    var end = str.length - n + 1;
	    for (var i = 0; i < end; i++) {
	      arr.push(str.substr(i, n));
	    }
	    return arr;
	  };
	};
	
	var gramDict = {
	  4: createNGram(4),
	  3: createNGram(3),
	  2: createNGram(2)
	};
	
	var getWordList = function getWordList() {
	  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  var wordList = [str];
	  var processStrict = function processStrict(str) {
	    return str.replace(/['‘’][^'‘’]*['‘’]|["”“][^"”“]*["”“]/g, function ($0) {
	      wordList.push($0.replace(/['‘’"”“]/g, ''));
	      return ' ';
	    });
	  };
	
	  var processChiese = function processChiese(str) {
	    return str.replace(/[\u4e00-\u9fff\uf900-\ufaff]+/g, function ($0) {
	      wordList.push($0);
	      for (var i = 4; i > 1; i--) {
	        if ($0.length > i) {
	          wordList.push.apply(wordList, gramDict[i]($0));
	        }
	      }
	      return ' ';
	    });
	  };
	
	  var processEnglish = function processEnglish(str) {
	    wordList.push.apply(wordList, str.split(/[^a-zA-Z]/).filter(function (o) {
	      return o.length > 2;
	    }).map(function (o) {
	      return o.toLowerCase();
	    }));
	  };
	
	  processEnglish(processChiese(processStrict(str)));
	  //console.log('search RegExp', new RegExp(wordList.join('|'), 'ig'));
	  return wordList;
	};
	
	var removeStopWord = function removeStopWord(str) {
	  str = str.replace(/\s*```([^`\n\r]*)[^`]*```\s*/g, function ($0, $1) {
	    return ' ' + $1 + ' ';
	  }); //去掉代码
	  str = str.replace(/<[^\u4e00-\u9fff\uf900-\ufaff>]+>|\([^\u4e00-\u9fff\uf900-\ufaff)]+\)|\w+[:@][\w.?#=&\/]+/g, ' '); //去掉html标签及超链接
	  str = str.replace(/怎么|的|是|开始|很多|我|觉得|非常|可以|一|了|上面|下面|这|那|哪|个|this|return|with/g, ' '); //去停用词
	  str = str.replace(/[^\u4e00-\u9fff\uf900-\ufaff\w]/g, ' '); //非中文或英文，替换成空格
	  return str;
	};
	
	var getTFs = function getTFs() {
	  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  var wordList = getWordList(removeStopWord(str)).slice(1);
	  var threeDict = {};
	  var fourDict = {};
	  var tfDict = {};
	  var tfList = [];
	
	  wordList.forEach(function (o) {
	    if (o.length < 2) {
	      return;
	    }
	    if (tfDict[o]) {
	      tfDict[o]++;
	    } else {
	      if (o.length == 3) {
	        threeDict[o] = 1;
	      }
	      if (o.length == 4) {
	        fourDict[o] = 1;
	      }
	      tfDict[o] = 1;
	    }
	  });
	  var token;
	  //去掉非词
	
	  var _loop = function _loop() {
	    var frequency = tfDict[token];
	    gramDict[3](token).forEach(function (o) {
	      if (frequency === tfDict[o]) {
	        delete tfDict[o];
	        delete threeDict[o];
	        gramDict[2](o).forEach(function (item) {
	          if (frequency === tfDict[item]) {
	            delete tfDict[item];
	          }
	        });
	      }
	    });
	  };
	
	  for (token in fourDict) {
	    _loop();
	  }
	
	  var _loop2 = function _loop2() {
	    var frequency = tfDict[token];
	    gramDict[2](token).forEach(function (o) {
	      if (frequency === tfDict[o]) {
	        delete tfDict[o];
	      }
	    });
	  };
	
	  for (token in threeDict) {
	    _loop2();
	  }
	
	  for (token in tfDict) {
	    tfList.push({
	      token: token,
	      frequency: tfDict[token]
	    });
	  }
	  return tfList.sort(function (a, b) {
	    return b.frequency - a.frequency;
	  }); //.slice(0,10).map(o=>o.token);
	};
	
	module.exports = {
	  getWordList: getWordList,
	  getTFs: getTFs,
	  getGlobalRegex: function getGlobalRegex(str) {
	    var wordSet = new Set(getWordList(str));
	    var wordList = [].concat(_toConsumableArray(wordSet));
	    return new RegExp(wordList.join('|'), 'ig');
	  }
	};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_util = __webpack_require__(2);
	
	var index = 0;
	var postMessage = function postMessage() {};
	var callbackDict = {};
	
	if (navigator.serviceWorker) {
	  navigator.serviceWorker.addEventListener('message', function (event) {
	    var _event$data = event.data,
	        cbid = _event$data.cbid,
	        resp = _event$data.resp;
	
	    if (cbid && callbackDict[cbid]) {
	      if (!callbackDict[cbid](resp)) {
	        delete callbackDict[cbid];
	      }
	    }
	  }); //页面通过监听service worker的message事件接收service worker的信息
	  postMessage = function postMessage(req, callback) {
	    if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.state == 'activated') {
	      index++;
	      var obj = { req: req };
	      if (callback) {
	        obj.cbid = m_util.getRandomName() + index;
	        callbackDict[obj.cbid] = callback;
	      }
	      navigator.serviceWorker.controller.postMessage(obj); //页面向service worker发送信息
	    }
	  };
	}
	
	module.exports = postMessage; //postMessage(message, callback)

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	
	var arr = location.host.split(".");
	var isLocalhost = arr.length === 1;
	var username = isLocalhost ? "swblog" : arr[0];
	var config = {
	  "author": username,
	  "nav": [["Home", "#!/index"], ["About", "#!/blog/about.md"]]
	};
	var searchIssueURL = void 0;
	var newIssueURL = void 0;
	
	var update = function update() {
	  var author = config.author;
	  config.logoTitle = config.logoTitle || author + "的博客";
	  searchIssueURL = 'https://github.com/' + author + '/' + author + '.github.io/issues?utf8=%E2%9C%93&q=';
	  newIssueURL = 'https://github.com/' + author + '/' + author + '.github.io/issues/new?title=';
	  if (window.CONFIG) {
	    CONFIG.username = username = config.author;
	  }
	};
	update();
	
	//先用缓存，请求回来再更新
	var getConfig = new Promise(function (resolve) {
	  BCD.ajaxCache('./json/config.json', function (data) {
	    config = data || config;
	    if (config.author) {
	      update();
	      resolve();
	      return 1; //缓存数据到localStorage
	    }
	    resolve();
	  }, 0, 1E3, true);
	});
	
	window.CONFIG = module.exports = {
	  username: username,
	  getIndex: function getIndex() {
	    return config.nav && config.nav[0] && config.nav[0][1] || "";
	  },
	  isLocalhost: isLocalhost,
	  getConfigSync: function getConfigSync() {
	    return config;
	  },
	  getConfig: getConfig,
	  getNewIssueURL: function getNewIssueURL(title) {
	    return newIssueURL + decodeURIComponent(isLocalhost ? "localhost测试评论" : title);
	  },
	  getSearchIssueURL: function getSearchIssueURL(title) {
	    return newIssueURL + decodeURIComponent(isLocalhost ? "localhost测试评论" : title);
	  }
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_util = __webpack_require__(2);
	var m_article = __webpack_require__(4);
	var m_config = __webpack_require__(7);
	
	BCD.addCommand('navigator_search', function (ele) {
	  ele.html('<div class="form-group open">' + '  <input type="text" class="form-control" placeholder="Search">' + '  <ul class="dropdown-menu" style="right:auto;display:none"></ul>' + '</div>' + '<button type="submit" class="btn btn-primary">Submit</button>');
	  var viewInput = ele.find('input');
	  var viewDrop = ele.find('ul').setView({
	    template: '<%(obj||[]).forEach(function(o){%>' + '<li data-on="?m=go" data-url="<%=o.href%>"><a><%=o.title%></a></li>' + //
	    '<%})%>'
	  });
	
	  var viewGroup = ele.find('.form-group');
	  var getWord = function getWord() {
	    return viewInput.val().trim();
	  };
	  var doSearch = function doSearch() {
	    var hash = '#!/search/' + encodeURIComponent(getWord());
	    if (BCD.getHash(0) == 'search') {
	      BCD.replaceHash(hash);
	    } else {
	      BCD.go(hash);
	    }
	    setTimeout(function () {
	      viewInput[0].focus(); //延时才能自动focus
	    }, 300);
	  };
	  ele.find('button').on('click', function (e) {
	    m_util.stopBubble(e);
	    var word = getWord();
	    if (word) {
	      doSearch();
	    }
	  });
	  var selectLi = null;
	  var selectList = null;
	  var index = -1;
	  var oldWord = '';
	  viewInput.on('blur', function () {
	    setTimeout(function () {
	      viewDrop.hide();
	    }, 200);
	  });
	  ele.on('keydown', function (e) {
	    //上下选择
	    if (selectList && (e.keyCode == 40 || e.keyCode == 38)) {
	
	      if (e.keyCode == 40) {
	        index++;
	        if (index >= selectList.length) {
	          index = 0;
	        }
	      }
	      if (e.keyCode == 38) {
	        index--;
	        if (index <= -selectList.length) {
	          index = 0;
	        }
	      }
	      selectList.css('background-color', '');
	      selectLi = selectList.eq(index);
	      selectLi.css('background-color', '#b2d8fa');
	    }
	  });
	
	  ele.on('keyup', function (e) {
	    //keypress要慢一拍 keypress input keyup
	    var word = getWord();
	    if (word) {
	      if (e.keyCode == 32) {
	        return doSearch();
	      }
	      if (e.keyCode == 13) {
	        if (selectLi) {
	          selectLi.trigger('click');
	        } else {
	          doSearch();
	        }
	      }
	
	      if (word == oldWord) {
	        return viewDrop.show();
	      }
	      oldWord = word;
	      var list = m_article.searchDirect(word);
	      if (list.length) {
	        index = -1;
	        selectLi = null;
	        viewDrop.reset(list);
	        selectList = viewDrop.find('li');
	      }
	    } else {
	      viewDrop.hide();
	    }
	  });
	});
	
	//顶部导航
	module.exports = function (option) {
	  var viewHeader = $('<header class="navbar navbar-inverse navbar-fixed-top bs-docs-nav" role="banner"></header>');
	  option = $.extend({
	    name: 'common/header',
	    getData: function getData() {
	      return m_config.getConfigSync();
	    },
	    template: '  <div class="container">' + '    <div class="navbar-header">' + '      <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">' + '        <span class="sr-only">Toggle navigation</span>' + '        <span class="icon-bar"></span>' + '        <span class="icon-bar"></span>' + '        <span class="icon-bar"></span>' + '      </button>' + '      <a data-on="?m=go" data-url="<%=CONFIG.getIndex()%>" class="logo-link" style="padding: 12px;"><%-obj.logoTitle%></a>' + '    </div>' + '    <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">' + '      <div class="navbar-form navbar-right" data-on="?m=navigator_search"></div>' + '      <ul class="nav navbar-nav"><%(obj.nav || []).forEach(function(o){%>' + '        <li class="<%=location.hash==o[1] ? "active" : ""%>"><a data-on="?m=replaceHash" data-url="<%=o[1]%>"><%-o[0]%></a></li>' + '        <%})%>' + '      </ul>' + '    </nav>' + '  </div>'
	  }, option);
	  return viewHeader.setView(option);
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var c_footer = __webpack_require__(10);
	var c_mainContainer = __webpack_require__(11);
	var m_article = __webpack_require__(4);
	var m_initOption = __webpack_require__(12);
	var c_pannel = __webpack_require__(13);
	var c_pannelList = __webpack_require__(14);
	var c_articleList = __webpack_require__(17);
	
	module.exports = function (page, key) {
	  var viewBody = c_mainContainer();
	  var viewTop = void 0;
	  var viewList = viewBody.find('[data-selector="main"]');
	  var viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
	  viewList.setView(c_articleList());
	  viewBody.addView(viewPannelList);
	
	  var viewFoot = c_footer();
	  var currentHash = void 0;
	  page.setView({
	    start: function start(hasRender) {
	      if (hasRender && currentHash == location.hash && BCD.history.getCode() == -1) {
	        return m_initOption.notRender(hasRender);
	      }
	      currentHash = location.hash;
	      var hashArr = decodeURIComponent(location.hash).split('/');
	      viewList.empty();
	      if (key == 'index') {
	        m_article.getListByTag(0, hashArr[2]).then(function (data) {
	          data.title = "最新文章";
	          data.hrefHead = '#!/index';
	          viewList.reset(data);
	        });
	      } else if (key == 'tag') {
	        var tag = hashArr[2];
	        m_article.getListByTag(tag, hashArr[3]).then(function (data) {
	          data.title = '"' + tag + '" 的最新文章';
	          data.hrefHead = '#!/tag/' + tag;
	          viewList.reset(data);
	        });
	      } else if (m_article.hasCatalog(key)) {
	        var pageNum = parseInt(hashArr[2] || 0);
	        if (pageNum === 0) {
	          if (viewTop) {
	            viewTop.show();
	          } else {
	            viewTop = c_pannel().reset({
	              isInline: true,
	              list: m_article.getChildCatalog(key).map(function (o) {
	                return {
	                  href: o.href,
	                  title: o.title
	                };
	              })
	            });
	          }
	          viewList.parent().prepend(viewTop);
	          //console.log('getChildCatalog', key, m_article.getChildCatalog(key));
	        } else if (viewTop) {
	          viewTop.hide();
	        }
	        m_article.getListByCatalog(key, pageNum).then(function (data) {
	          data.title = '"' + data.tag.replace(/^[^/]+\//, '') + '" 的最新文章';
	          data.hrefHead = '#!/' + BCD.getHash(0);
	          viewList.reset(data);
	        });
	      }
	    },
	    title: '文章列表',
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	//页脚
	var m_config = __webpack_require__(7);
	module.exports = function (option) {
	  var viewHeader = $('<footer></footer>');
	  option = $.extend({
	    name: 'common/footer',
	    getData: function getData() {
	      return m_config.getConfigSync();
	    },
	    template: '<div class="container">' + '  <hr>' + '  <p class="text-center">Copyright <%-obj.author%> © <%=new Date().getFullYear()%>. All rights reserved.</p>' + '</div>'
	  }, option);
	  return viewHeader.setView(option);
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function () {
	  return $('<div class="container">' + '  <div class="row">' + '    <div class="col-sm-7 col-md-8 col-lg-8">' + '     <div data-selector="main"></div></div>' + '    <div class="col-sm-5 col-md-4 col-lg-4" data-selector="panel"></div>' + '  </div>' + '</div>');
	};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	'use strict';
	
	function anchorBack() {
	    if (history.state && history.state.scrollY) {
	        //支持锚点返回
	        if (BCD.history.getCode() == -1) {
	            scrollTo(0, history.state.scrollY);
	        }
	        BCD.extendState({ //保证刷新可回到头部
	            scrollY: 0
	        });
	    }
	}
	
	//带锚点返回，不reset子view
	function notRender(hasRender) {
	    if (hasRender) {
	        BCD.getPage().show();
	        anchorBack();
	        return 'show';
	    }
	}
	module.exports = {
	    notRender: notRender,
	    anchorBack: anchorBack
	};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	'use strict';
	
	//顶部导航
	module.exports = function (option) {
	  var view = $('<div class="panel panel-primary"></div>');
	  option = $.extend({
	    name: 'blog/panel',
	    template: '<%if(obj.title){%><div class="panel-heading">' + '  <h4><%-obj.title%></h4>' + '</div><%}%>' + '<div class="panel-body">' + '  <%if(obj.isInline){%>' + '    <ul class="list-inline">' + '     <%(obj.list || []).forEach(function(o){%>' + '      <%if(o.href){%>' + '       <li><a data-on="?m=go" data-url="<%=o.href%>"><%=o.title%></a></li>' + '      <%}else{%>' + '       <li><a data-on="?m=go" data-url="#!/tag/<%=o%>"><%=o%></a></li>' + '      <%}%>' + '     <%})%>' + '    </ul>' + '  <%}else{%>' + '    <ul class="list-group">' + '     <%(obj.list || []).forEach(function(o){%>' + '      <li class="list-group-item"><a data-on="?m=go" data-url="<%=o.href%>"><%=o.title%></a>' + '       <%=o.time ? "<span style=\\\"color: #a2a34f;\\\">("+o.time+")</span>" : ""%></li>' + '     <%})%>' + '    </ul>' + '    <%}%>' + '</div>',
	    end: function end(data) {
	      if (!(data && data.list && data.list.length)) {
	        this.hide();
	        return 'hide';
	      }
	    }
	  }, option);
	  return view.setView(option);
	};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_article = __webpack_require__(4);
	var m_recommend = __webpack_require__(15);
	var c_pannel = __webpack_require__(13);
	module.exports = function (view) {
	  var viewPannelBook = c_pannel({
	    data: {
	      title: '书籍',
	      list: m_article.getBooks().map(function (o) {
	        return {
	          href: o.href,
	          title: o.title,
	          time: o.time
	        };
	      })
	    }
	  });
	  var viewPannelCatalog = c_pannel({
	    data: {
	      title: '分类',
	      list: m_article.getCatalogs().filter(function (o) {
	        return o.tagList.length === 1;
	      }).map(function (o) {
	        return {
	          title: o.title,
	          href: o.href
	        };
	      })
	    }
	  });
	  var viewPannelTag = c_pannel({
	    data: {
	      isInline: true,
	      title: '标签',
	      list: m_article.getTags()
	    }
	  });
	
	  var viewPannelRecommendPost = c_pannel({
	    delay: true
	  });
	  m_recommend.getRecommend(function (list) {
	    viewPannelRecommendPost.reset({
	      title: '推荐阅读',
	      list: list.map(function (o) {
	        return {
	          href: o.href,
	          title: o.title,
	          time: o.time
	        };
	      })
	    });
	  });
	
	  return view.setView({
	    viewList: [viewPannelBook, viewPannelCatalog, viewPannelTag, viewPannelRecommendPost]
	  });
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var m_article = __webpack_require__(4);
	var m_search = __webpack_require__(5);
	var m_readHistory = __webpack_require__(16);
	
	var filter = function filter(list) {
	  var arr = [];
	  var itemSet = new Set(list);
	  var uniqList = [].concat(_toConsumableArray(itemSet));
	  var currentPath = decodeURIComponent(location.hash.replace('#!/', ''));
	  uniqList.some(function (o) {
	    if (!m_readHistory.hasRead(o.path) && o.path != currentPath) {
	      arr.push(o);
	      if (arr.length > 10) {
	        return true;
	      }
	    }
	  });
	  return arr;
	};
	
	var getCorrelation = function getCorrelation(a_tfList) {
	  var tfDict = {};
	  a_tfList.forEach(function (o) {
	    tfDict[o.token] = o.frequency;
	  });
	  return function (b_tfList) {
	    var total = b_tfList.reduce(function (sum, item) {
	      return sum += item.frequency;
	    }, 0);
	    return b_tfList.reduce(function (weight, item) {
	      weight += (tfDict[item.token] || 0) * item.frequency / total;
	      return weight;
	    }, 0);
	  };
	};
	
	var getSimilarArticles = function getSimilarArticles(a_tfList) {
	  var list = m_article.getArticleList().filter(function (o) {
	    return o.tfList && o.tfList.length;
	  });
	  var calModel = getCorrelation(a_tfList);
	  var weightList = list.map(function (o) {
	    return {
	      article: o,
	      weight: calModel(o.tfList)
	    };
	  }).sort(function (a, b) {
	    return b.weight - a.weight;
	  });
	  console.table(weightList.slice(0, 20).map(function (o) {
	    return {
	      title: o.article.title,
	      weight: o.weight
	    };
	  }));
	  return weightList.map(function (o) {
	    return o.article;
	  });
	};
	
	var getMutiSamples = function getMutiSamples() {
	  var tagDict = {};
	  var retList = [];
	  var originList = m_article.getArticleList();
	  var list = originList.filter(function (o) {
	    return !m_readHistory.hasRead(o.path);
	  });
	  if (list.some(function (o) {
	    var tagList = o.tagList || [];
	    var tagName = tagList[tagList.length - 1];
	    if (tagDict[tagName]) {
	      tagDict[tagName].push(o);
	    } else {
	      tagDict[tagName] = [];
	      retList.push(o);
	    }
	    if (retList.length == 10) {
	      return true;
	    }
	  })) {
	    return retList;
	  } else {
	    var tagList = Object.keys(tagDict);
	    for (var i = 0; i < 10; i++) {
	      for (var j = 0; j < tagList.length; j++) {
	        var item = void 0;
	        var tagName = tagList[j];
	        if (item = tagDict[tagName][i]) {
	          retList.push(item);
	          if (retList.length == 10) {
	            return retList;
	          }
	        }
	      }
	    }
	  }
	  return retList.concat(originList.slice(0, 10 - retList.length));
	};
	
	var getRecommend = function getRecommend(callback) {
	  var key = decodeURIComponent(BCD.getHash(0));
	  var articleList = getMutiSamples();
	  var delayTime = 2E3 - (Date.now() - m_article.startTime);
	  delayTime = m_article.isPreload ? 0 : delayTime < 0 ? 0 : delayTime;
	
	  switch (true) {
	    case key == 'tag':
	      var word = decodeURIComponent(BCD.getHash(1));
	      setTimeout(function () {
	        m_article.searchList(word, function (list) {
	          callback(filter(list.concat(articleList)));
	        }, true);
	      }, delayTime);
	      break;
	    case m_article.hasArticle(key):
	      setTimeout(function () {
	        m_article.getArticleContent(key).then(function (data) {
	          var tagList = data.tagList;
	          var keyWords = (data.tfList || []).slice(0, 10).map(function (o) {
	            return o.token;
	          });
	          console.log('本文关键词为：', keyWords.join(','));
	          callback(filter(getSimilarArticles(data.tfList).concat(articleList)));
	        });
	      }, delayTime);
	      break;
	    case m_article.hasCatalog(key):
	      setTimeout(function () {
	        m_article.getListByCatalog(key, 0, 999).then(function (data) {
	          //在目录列表中已经有当前目录文章的展示了，在这里优先展示搜索到的内容
	          var catalog = m_article.getCatalogMessage(key);
	          var alist = data.list || [];
	          m_article.searchList(catalog.tagList.join(' '), function (list) {
	            callback(filter(list.concat(alist.concat(articleList))));
	          }, true);
	        });
	      }, delayTime);
	      break;
	
	    default:
	      callback(articleList);
	      break;
	
	  }
	};
	module.exports = {
	  getRecommend: getRecommend
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var m_config = __webpack_require__(7);
	var m_article = __webpack_require__(4);
	var storageKey = 'read_history';
	var readHistory = {};
	var init = function init() {
	  try {
	    readHistory = $.extend({}, JSON.parse(localStorage.getItem(storageKey)), readHistory);
	  } catch (e) {}
	};
	
	m_config.getConfig.then(function () {
	  storageKey = 'read_history_' + m_config.username;
	  init();
	});
	
	var addHistory = function addHistory(path) {
	  readHistory[path] = Date.now();
	  localStorage.setItem(storageKey, JSON.stringify(readHistory));
	};
	
	module.exports = {
	  addHistory: addHistory,
	  hasRead: function hasRead(path) {
	    return !!readHistory[path];
	  },
	  getReadTime: function getReadTime(path) {
	    return readHistory[path];
	  }
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	'use strict';
	
	//文章列表
	module.exports = function (option) {
	  return $.extend({
	    name: 'blog/article_list',
	    template: '<h3><%=obj.title%></h3>' + '<%if(!(obj.list && obj.list.length)){%>' + '<br><hr><center><h3>暂无内容</h3></center>' + '<%}else{(obj.list || []).forEach(function(o, idx){%><article>' + '  <h2><a data-on="?m=go" data-url="<%=o.href%>"><%-o.title%></a></h2>' + '  <div class="row">' + '    <div class="group1 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-folder-open"></span><%(o.tagList||[]).forEach(function(item, i, arr){%>' + '       <%=i ? "&nbsp;>&nbsp;" : "&nbsp;"%><a data-on="?m=go" ' + '       data-url="#!/<%=encodeURIComponent(["blog"].concat(arr.slice(0, i+1)).join("/"))%>"><%=item%></a><%})%>' + '    </div>' + '    <div class="group2 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-time"></span>&nbsp;<%-o.time%>' + '    </div>' + '  </div>' + '  <hr>' + '  <div data-on="?m=mkview&idx=<%=idx%>">' + '  </div><br />' + '' + '  <p class="text-right">' + '    <a data-on="?m=go" data-url="<%=o.href%>">' + '      continue reading...' + '    </a>' + '  </p>' + '  <hr>' + '</article><%})%>' + '' + '<ul class="pager">' + '  <li class="previous"><a <%if(obj.page==0){%>style="opacity: 0.5;"<%}else{%>' + 'data-on="?m=go" data-url="<%=obj.hrefHead+"/"+(obj.page-1)%>"<%}%>>&larr; Previous</a></li>' + '  <li class="next"><a <%if(obj.page==Math.floor(obj.num/obj.count)){%>style="opacity: 0.5;"<%}else{%>' + 'data-on="?m=go" data-url="<%=obj.hrefHead+"/"+(obj.page+1)%>"<%}%>>Next &rarr;</a></li>' + '</ul><%}%>'
	  }, option);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var s_mainContainer = __webpack_require__(19);
	var m_article = __webpack_require__(4);
	var m_readHistory = __webpack_require__(16);
	var c_articleList = __webpack_require__(17);
	
	module.exports = function (page, key) {
	  page.html(s_mainContainer);
	  var viewContent = page.find('[data-selector="main"]');
	  var viewSlidebar = page.find('[data-selector="slidebar"]');
	  var slidebar = void 0;
	  var currentHash = void 0;
	  viewSlidebar.setView({
	    name: 'blog/slidebar',
	    template: '<div data-on="?m=mkview"></div>'
	  });
	
	  viewContent.setView({
	    name: 'blog/blog',
	    template: '<div data-on="?m=mkview"></div>'
	  });
	
	  page.setView({
	    title: m_article.getName(key),
	    start: function start() {
	      if (currentHash !== location.hash) {
	        viewContent.empty();
	        currentHash = location.hash;
	      }
	      this.show();
	      m_article.getArticleContent(m_article.getSidebarPath(key)).then(function (data) {
	        var baseHash = '#!/' + BCD.getHash(0);
	        if (!slidebar) {
	          slidebar = $.extend({}, data);
	          var content = slidebar.content || '';
	          var chapters = slidebar.chapters = [];
	
	          slidebar.content = content.replace(/<%(([^>]|[^%]>)+)%>/g, function ($0, $1) {
	            var item = {};
	            var fileName = '';
	            if ($1.indexOf(']') > 0) {
	              //这种格式：[描述](相对与当前目录的地址)
	              var arr = $1.substr(1, $1.length - 2).split(/\]\s*\(/);
	              item.title = arr[0] || '';
	              item.href = baseHash + '/' + (arr[1] || '');
	              fileName = arr[1];
	            } else {
	              item.title = $1;
	              item.href = baseHash + '/' + $1 + '.md';
	              fileName = $1 + '.md';
	            }
	            item.path = key + '/' + fileName;
	            if (m_article.hasArticle(item.path)) {
	              chapters.push(item);
	            }
	            return '<a data-on="?m=replaceHash" data-url="' + item.href + '">' + item.title + '</a>' + '<span data-path="' + item.path + '" class="icon glyphicon glyphicon-ok" aria-hidden="true" ' + 'style="' + (m_readHistory.hasRead(item.path) ? '' : 'display:none') + '"></span>';
	          });
	          viewSlidebar.reset(slidebar);
	          setTimeout(function () {
	            viewSlidebar.exeCommand();
	          });
	        }
	        var fileName = decodeURIComponent(key + location.hash.replace(baseHash, ''));
	        if (m_article.hasArticle(fileName)) {
	          m_article.getArticleContent(fileName).then(function (data) {
	            m_readHistory.addHistory(fileName);
	            $(viewSlidebar.find('li.active')).removeClass('active');
	            var currentDom = $('.slidebar [data-path="' + fileName + '"]');
	            currentDom.parent('li').addClass('active');
	            currentDom.show();
	            viewContent.reset(data);
	          });
	        } else if (slidebar.chapters[0]) {
	          return BCD.replaceHash(slidebar.chapters[0].href);
	        } else {
	          viewContent.reset({
	            content: '敬请期待',
	            title: fileName
	          });
	        }
	      });
	    }
	  });
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = '  <div class="row">' + '    <div class="slidebar col-sm-5 col-md-4 col-lg-3" data-selector="slidebar"></div>' + '    <div class="col-sm-offset-5 col-md-offset-4 col-lg-offset-3 col-sm-7 col-md-8 col-lg-9" data-selector="main"></div>' + '  </div>';

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	//有侧边栏的内容展示
	
	var c_mainContainer = __webpack_require__(11);
	var c_footer = __webpack_require__(10);
	var m_article = __webpack_require__(4);
	var m_readHistory = __webpack_require__(16);
	var c_pannelList = __webpack_require__(14);
	var c_content = __webpack_require__(21);
	var m_initOption = __webpack_require__(12);
	
	module.exports = function (page, key) {
	  var viewBody = c_mainContainer();
	  var viewContent = viewBody.find('[data-selector="main"]');
	  var viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
	  viewContent.setView(c_content({
	    delay: true
	  }));
	  viewBody.addView(viewContent);
	  viewBody.addView(viewPannelList);
	
	  var viewFoot = c_footer();
	  page.setView({
	    start: function start(hasRender) {
	      if (hasRender) {
	        return m_initOption.notRender(hasRender);
	      }
	      if (m_article.hasArticle(key)) {
	        m_article.getArticleContent(key).then(function (data) {
	          m_readHistory.addHistory(key);
	          page.setView({ title: data.title });
	          document.title = data.title;
	          viewContent.reset(data);
	        });
	      }
	    },
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	window.CONFIG = __webpack_require__(7);
	//单个文章
	module.exports = function (option) {
	  return $.extend({
	    name: 'blog/content',
	    template: '<h1><%=obj.title%></h1>' + '  <div class="row">' + '    <div class="group1 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-folder-open"></span><%(obj.tagList||[]).forEach(function(item, i, arr){%>' + '       <%=i ? "&nbsp;>&nbsp;" : "&nbsp;"%><a data-on="?m=go" ' + '       data-url="#!/<%=encodeURIComponent(["blog"].concat(arr.slice(0, i+1)).join("/"))%>"><%=item%></a><%})%>' + '    </div>' + '    <div class="group2 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-time"></span>&nbsp;<%-obj.time%>' + '    </div>' + '  </div>' + '  <hr>' + '  <div data-on="?m=mkview">' + '  </div><br />' + '  <hr>' + '</article>' + '<ul class="pager">' + '  <li class="previous"><a data-on="?m=back">← 返回</a></li>' + ' <li><a target="_blank" href="<%=CONFIG.getSearchIssueURL(obj.title)%>">查看评论</a></li>' + ' <li class="next"><a target="_blank" href="<%=CONFIG.getNewIssueURL(obj.title)%>">去评论 &rarr;</a></li>' + '</ul>'
	  }, option);
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	//针对导航的，没有侧边栏的内容展示
	
	var c_mainContainer = __webpack_require__(11);
	var c_footer = __webpack_require__(10);
	var m_config = __webpack_require__(7);
	var m_article = __webpack_require__(4);
	var m_initOption = __webpack_require__(12);
	
	module.exports = function (page) {
	  var viewBody = $('<div class="container" style="min-height:' + ((window.innerHeight || 640) - 200) + 'px"/>').setView({
	    name: 'blog/blog',
	    delay: true,
	    template: '<div data-on="?m=mkview"></div>'
	  });
	
	  var viewFoot = c_footer();
	  page.setView({
	    start: function start(hasRender) {
	      if (hasRender && BCD.history.getCode() == -1) {
	        return m_initOption.notRender(hasRender);
	      }
	      var key = location.hash.replace('#!/', '');
	      if (m_article.hasArticle(key)) {
	        m_article.getArticleContent(key).then(function (data) {
	          page.setView({ title: data.title });
	          document.title = data.title;
	          viewBody.reset(data);
	        });
	      } else {
	        BCD.replaceHash(m_config.getIndex());
	      }
	    },
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var c_footer = __webpack_require__(10);
	var c_mainContainer = __webpack_require__(11);
	var m_initOption = __webpack_require__(12);
	var c_pannelList = __webpack_require__(14);
	var m_pullArticle = __webpack_require__(24);
	
	module.exports = function (page, key) {
	  var viewBody = c_mainContainer();
	  var viewList = viewBody.find('[data-selector="main"]');
	  var viewPannelList = c_pannelList(viewBody.find('[data-selector="panel"]'));
	  viewList.setView({
	    viewList: [m_pullArticle.container]
	  });
	
	  viewBody.addView(viewList);
	  viewBody.addView(viewPannelList);
	
	  var viewFoot = c_footer();
	  var oldWord = '';
	  page.setView({
	    start: function start(hasRender) {
	      var word = decodeURIComponent(BCD.getHash(1));
	      if (hasRender && oldWord == word) {
	        return m_initOption.notRender(true);
	      }
	      oldWord = word;
	      m_pullArticle.init(word);
	    },
	    title: '搜索结果',
	    viewList: [viewBody, viewFoot]
	  });
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * 不断增加的列表
	 */
	var m_article = __webpack_require__(4);
	var container = $('<div style="display:none;">' + '<div data-selector="tips" style="margin: 20px;font-size: 20px;"></div>' + '<div data-selector="pull_list"></div>' + '</div>');
	
	var viewRank = $(container.find('[data-selector="pull_list"]'));
	var viewTips = $(container.find('[data-selector="tips"]'));
	
	viewRank.setView({
	  full: 'append',
	  template: '<%(obj.list || []).forEach(function(o, idx, list){%><article>' + '  <h2><a data-on="?m=go" data-url="<%=o.href%>"><%=o.title%></a></h2>' + '  <div class="row">' + '    <div class="group1 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-folder-open"></span><%(o.tagList||[]).forEach(function(item, i, arr){%>' + '       <%=i ? "&nbsp;>&nbsp;" : "&nbsp;"%><a data-on="?m=go" ' + '       data-url="#!/<%=encodeURIComponent(["blog"].concat(arr.slice(0, i+1)).join("/"))%>"><%=item%></a><%})%>' + '    </div>' + '    <div class="group2 col-sm-6 col-md-6">' + '      <span class="glyphicon glyphicon-time"></span>&nbsp;<%-o.time%>' + '    </div>' + '  </div>' + '  <hr>' + '  <div data-on="?m=mkview&idx=<%=idx%>">' + '  </div><br />' + '  <p class="text-right">' + '    <a data-on="?m=go" data-url="<%=o.href%>">' + '      continue reading...' + '    </a>' + '  </p>' + '  <%if(idx<list.length-1)print("<hr>")%>' + '</article><%})%>'
	});
	
	module.exports = {
	  container: container,
	  init: function init(word) {
	    var count = 0;
	    var processCount = 0;
	    var keyWord = '<span class="text-danger">' + word + '</span>';
	    viewTips.html('正在搜索：' + keyWord);
	    viewRank.empty();
	    m_article.searchList(word, function (data) {
	      viewRank.reset(data);
	      count += data.list && data.list.length || 0;
	      processCount += data.checkNum;
	      if (processCount < data.totalNum) {
	        viewTips.html('在(' + processCount + '/' + data.totalNum + ')搜索到' + count + '篇关于：' + keyWord);
	      } else {
	        viewTips.html('在' + data.totalNum + '篇文章中搜索到' + count + '篇关于：' + keyWord);
	      }
	
	      //console.log(data);
	    });
	  }
	};

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map