const zh = {
  'app.name': 'InspireBoard',
  'app.subtitle': '收藏你的图片灵感，整理你的创意画板',

  /* Nav */
  'nav.home': '首页', 'nav.explore': '探索', 'nav.collections': '画板',
  'nav.favorites': '我的收藏', 'nav.create': '创建', 'nav.settings': '设置',
  'nav.viewProfile': '查看资料', 'nav.signOut': '退出登录',

  /* TopBar */
  'topbar.searchPlaceholder': '搜索灵感、风格和更多内容...',
  'topbar.upload': '上传',
  'topbar.theme': '主题外观将在后续实现',

  /* Content */
  'content.all': '全部灵感', 'content.favorites': '我的收藏',
  'content.search': '搜索：{term}', 'content.results': '找到 {count} 个结果',
  'content.images': '{count} 张图片', 'content.favCount': '已收藏 {count} 张',

  /* Category */
  'category.all': '全部', 'category.ui': 'UI设计', 'category.web': '网页设计',
  'category.illustration': '插画', 'category.poster': '海报',
  'category.decoration': '装修', 'category.photography': '摄影', 'category.other': '其他',

  /* Sort */
  'sort.newest': '最新添加', 'sort.oldest': '最早添加', 'sort.favorites': '收藏优先',

  /* Card */
  'card.edit': '编辑', 'card.delete': '删除',
  'card.favorite': '收藏', 'card.favorited': '已收藏',
  'card.viewDetail': '查看详情', 'card.loadFailed': '图片加载失败',

  /* Form */
  'form.addTitle': '添加灵感', 'form.editTitle': '编辑灵感',
  'form.imageUrl': '图片 URL', 'form.imageUrlPlaceholder': '请输入图片链接地址',
  'form.chooseImage': '选择图片', 'form.changeImage': '更换图片',
  'form.imageHint': 'JPG / PNG / WebP，最大 5MB。本地图片优先。',
  'form.preview': '预览', 'form.previewFailed': '图片加载失败',
  'form.title': '标题', 'form.titlePlaceholder': '请输入图片标题',
  'form.category': '分类', 'form.categoryPlaceholder': '请选择分类',
  'form.tags': '标签', 'form.tagsHint': '（多个标签用逗号分隔）',
  'form.tagsPlaceholder': '例如：蓝色, 极简, 卡片风',
  'form.board': '所属画板', 'form.boardNone': '不加入画板',
  'form.cancel': '取消', 'form.confirmAdd': '确认添加', 'form.saveEdit': '保存修改',
  'form.errorImageRequired': '请填写图片 URL 或选择本地图片',
  'form.requiredTitle': '用户名不能为空',
  'form.errorTitleRequired': '请输入图片标题',
  'form.errorCategoryRequired': '请选择分类',
  'form.errorUrlOrFile': '请填写 URL 或选择图片',
  'form.errorImageTooLarge': '图片过大，请选择 2MB 以下的图片',
  'form.errorImageType': '仅支持 JPG、PNG、WebP 格式的图片',
  'form.errorImageRead': '图片读取失败，请重试',

  /* Board */
  'board.myBoards': '我的画板', 'board.newBoard': '新建画板', 'board.editBoard': '编辑画板',
  'board.name': '画板名称', 'board.description': '描述',
  'board.create': '创建', 'board.save': '保存', 'board.delete': '删除',
  'board.backToList': '← 返回画板列表',
  'board.empty': '这个画板还没有灵感', 'board.addToBoard': '添加到这个画板',
  'board.count': '{count} 张灵感', 'board.boardsCount': '{count} 个画板',
  'board.cannotDelete': '该画板下还有灵感，不能删除',
  'board.deleteConfirm': '确定要删除画板「{name}」吗？',
  'board.noBoards': '还没有画板', 'board.createHint': '创建一个画板来整理你的灵感',

  /* Profile */
  'profile.pins': 'Pins', 'profile.boards': 'Boards', 'profile.likes': 'Likes', 'profile.about': 'About',
  'profile.editProfile': '编辑资料', 'profile.share': '分享',
  'profile.recentActivity': '最近动态', 'profile.favoriteTags': '常用标签', 'profile.profileStats': '个人统计',
  'profile.activityAdded': 'Added', 'profile.activityLiked': 'Liked', 'profile.activityBoard': 'Created board',
  'profile.noPins': '还没有发布任何灵感', 'profile.noPinsHint': '点击添加，收藏你的第一张图片灵感',
  'profile.noLikes': '还没有收藏', 'profile.noLikesHint': '点击图片上的爱心收藏喜欢的灵感',
  'profile.noBoards': '还没有画板',
  'profile.noActivity': '暂无动态', 'profile.noTags': '暂无标签',
  'profile.pinCount': '{count} 个灵感', 'profile.boardCount': '{count} 个画板',
  'profile.likeCount': '{count} 个收藏', 'profile.uploadCount': '{count} 个上传',
  'profile.joined': '加入于 {date}', 'profile.bio': 'Collecting ideas, boards, and visual inspiration.',

  /* Search */
  'search.suggestions': 'Suggestions', 'search.recent': 'Recent',
  'search.trending': '热门搜索', 'search.clearRecent': '清除最近搜索',
  'search.filters': '筛选', 'search.clearAll': '清除全部',
  'search.orientation': '方向', 'search.colorMood': '色调',
  'search.contentType': '内容类型', 'search.savedSearches': '已保存搜索',
  'search.saveSearch': '保存当前搜索', 'search.searchSaved': '搜索已保存',
  'search.all': '全部', 'search.images': '图片', 'search.boards': '画板',
  'search.people': '用户', 'search.products': '产品',
  'search.peopleSoon': '用户搜索将在后续实现', 'search.productsSoon': '产品搜索将在后续实现',
  'search.noResults': '没有找到匹配的灵感', 'search.noBoards': '没有找到匹配的画板',
  'search.clearSearch': '清空搜索',

  /* Settings */
  'settings.title': '账号设置',
  'settings.description': '管理你的个人信息、偏好设置和账号安全。',
  'settings.personalInfo': '个人信息', 'settings.security': '安全',
  'settings.preferences': '偏好设置', 'settings.notifications': '通知',
  'settings.connectedAccounts': '关联账号', 'settings.privacy': '隐私',
  'settings.username': '用户名', 'settings.email': '邮箱', 'settings.avatarUrl': '头像链接',
  'settings.bio': '简介', 'settings.saveChanges': '保存修改', 'settings.saving': '保存中...',
  'settings.password': '密码', 'settings.change': '修改',
  'settings.twoFactor': '两步验证', 'settings.loginSessions': '登录会话',
  'settings.language': '语言', 'settings.content': '内容偏好',
  'settings.sensitiveContent': '敏感内容', 'settings.autoplay': '自动播放视频',
  'settings.pushNotif': '推送通知', 'settings.emailUpdates': '邮件更新',
  'settings.messages': '消息', 'settings.weeklySummary': '每周摘要',
  'settings.profileVisibility': '资料可见性', 'settings.blocked': '已拉黑账号',
  'settings.downloadData': '下载数据', 'settings.deleteAccount': '删除账号',
  'settings.recentBoards': '最近画板',
  'settings.promptTitle': '持续激发灵感',
  'settings.promptDesc': '创建画板、收藏灵感，打造属于你的创意空间。',
  'settings.createBoard': '创建画板',

  /* Auth */
  'auth.login': '登录', 'auth.register': '注册',
  'auth.username': '用户名', 'auth.email': '邮箱',
  'auth.password': '密码', 'auth.confirmPassword': '确认密码',
  'auth.loginBtn': '登录', 'auth.registerBtn': '注册',
  'auth.switchToRegister': '还没有账号？', 'auth.switchToLogin': '已有账号？',
  'auth.switchRegister': '注册', 'auth.switchLogin': '登录',
  'auth.pleaseWait': '请稍候...',
  'auth.errorEmail': '请输入邮箱', 'auth.errorPassword': '请输入密码',
  'auth.errorUsername': '请输入用户名', 'auth.errorPasswordLen': '密码长度至少 6 位',
  'auth.errorPasswordMatch': '两次密码不一致',
  'auth.checking': '正在检查登录状态...',

  /* Toast */
  'toast.addSuccess': '灵感添加成功', 'toast.editSuccess': '修改成功',
  'toast.deleted': '已删除', 'toast.deleteFailed': '删除失败',
  'toast.favAdded': '已加入收藏', 'toast.favRemoved': '已取消收藏',
  'toast.uploadFailed': '上传失败', 'toast.saveFailed': '保存失败',
  'toast.boardCreated': '画板创建成功', 'toast.boardUpdated': '画板已更新',
  'toast.boardDeleted': '画板已删除',
  'toast.profileUpdated': '资料已更新',
  'toast.sessionExpired': '登录已失效，请重新登录',
  'toast.backendDown': '后端连接失败，请确认服务是否已启动',
  'toast.usingCache': '后端连接失败，已使用本地缓存',
  'toast.comingSoon': '该功能将在后续实现',
  'toast.notifSoon': '通知功能将在后续实现',
  'toast.themeSoon': '主题外观将在后续实现',
  'toast.helpSoon': '帮助中心将在后续实现',
  'toast.passwordSoon': '密码修改将在后续实现',
  'toast.authSoon': '第三方账号绑定将在后续实现',
  'toast.actionFailed': '操作失败',
  'toast.notImplemented': '该功能将在后续实现',
  'toast.searchSaved': '搜索已保存',
  'toast.exportSoon': '数据导入导出将在后续实现',

  /* Time */
  'time.today': '今天', 'time.yesterday': '昨天',
  'time.daysAgo': '{count} 天前', 'time.weeksAgo': '{count} 周前',
  'time.monthsAgo': '{count} 个月前', 'time.yearsAgo': '{count} 年前',

  /* Loading / Empty */
  'loading.default': '正在加载灵感数据...',
  'empty.noInspirations': '还没有灵感',
  'empty.noInspirationsHint': '点击添加，开始收藏你的第一张灵感图片',
  'empty.noResults': '没有找到匹配的灵感',
  'empty.noResultsHint': '试试换个关键词或清空筛选',
  'empty.addBtn': '添加灵感', 'empty.clearBtn': '清空筛选',

  /* Common */
  'common.save': '保存', 'common.cancel': '取消', 'common.confirm': '确认',
  'common.confirmDelete': '确定要删除「{name}」吗？此操作不可恢复。',
  'common.notLoggedIn': '未登录',
} as const;

export default zh;