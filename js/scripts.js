!(function (NioApp, $) {
    "use strict";
    NioApp.Package.name = "CovStats";
    NioApp.Package.version = "1.0.0";

    var $win = $(window), $body = $('body'), $doc = $(document), 

    //class names
    _body_theme  = 'nio-theme',
    _menu        = 'nk-menu',
    _short_nav   = 'short-nav', 
    _mobile_nav  = 'mobile-menu',
    _header      = 'nk-header', 
    _header_menu = 'nk-header-menu', 
    _sidebar     = 'nk-sidebar', 
    _sidebar_mob = 'nk-sidebar-mobile', 
    _sidebar_short = 'nk-sidebar-short',
    //breakpoints
    _break       = NioApp.Break;

    function extend(obj, ext) {
        Object.keys(ext).forEach(function(key) { obj[key] = ext[key]; });
        return obj;
    }
    // ClassInit @v1.0
    NioApp.ClassBody = function() {
        NioApp.AddInBody(_sidebar); 
    };

    // ClassInit @v1.0
    NioApp.ClassNavMenu = function() {
        NioApp.BreakClass('.'+_sidebar, _break.lg, {timeOut: 0, classAdd: _sidebar_mob, ignore: _sidebar_short} ); //io-v140
        NioApp.BreakClass('.'+_sidebar_short, _break.md, {timeOut: 0, classAdd: _sidebar_mob} ); //io-v140
        $win.on('resize', function() {
            NioApp.BreakClass('.'+_sidebar, _break.lg, {classAdd: _sidebar_mob, ignore: _sidebar_short} ); //io-v140
            NioApp.BreakClass('.'+_sidebar_short, _break.md, {classAdd: _sidebar_mob} ); //io-v140
        });
    };

    // Code Prettify @v1.0
    NioApp.Prettify = function(){
        window.prettyPrint && prettyPrint();
    };

    // CurrentLink Detect @v1.0
    NioApp.CurrentLink = function(){
        var _link = '.nk-menu-link, .menu-link, .nav-link',
            _currentURL = window.location.href, fileSplit, lastPath1, lastPath2, lastPath,
            fileName = _currentURL.substring(0, (_currentURL.indexOf("#") == -1) ? _currentURL.length : _currentURL.indexOf("#"));

            fileName = fileName.substring(0, (fileName.indexOf("?") == -1) ? fileName.length : fileName.indexOf("?")),
            fileName = (fileName.charAt(fileName.length - 1) === '/') ? fileName.substring(0, fileName.length - 1) : fileName,
            fileSplit = fileName.split('/'), lastPath = (fileSplit.length > 0) ? fileSplit[fileSplit.length - 1] : fileSplit;

        $(_link).each(function() {
            var self = $(this), _self_link = self.attr('href'), 
            _self_path = (_self_link.charAt(_self_link.length - 1) === '/') ? _self_link.substring(0, _self_link.length - 1) : _self_link,
            _self_split = _self_path.split('/'), _self_last = (_self_split.length > 0) ? _self_split[_self_split.length - 1] : _self_split;

            if (_self_last === lastPath ) { 
                self.closest("li").addClass('active current-page').parents().closest("li").addClass("active current-page");
                self.closest("li").children('.nk-menu-sub').css('display','block');
                self.parents().closest("li").children('.nk-menu-sub').css('display','block');
            } else {
                self.closest("li").removeClass('active current-page').parents().closest("li:not(.current-page)").removeClass("active");
            }
        });
    };

    // Toggle Screen @v1.0
    NioApp.TGL.screen = function (elm){
        if($(elm).exists()) {        
            $(elm).each(function(){
                var ssize = $(this).data('toggle-screen');
                if(ssize){ $(this).addClass('toggle-screen-' + ssize ); }
            });
        }
    };

    // Toggle Content @v1.0
    NioApp.TGL.content = function (elm, opt){
        var toggle = (elm) ? elm : '.toggle', $toggle = $(toggle), $contentD = $('[data-content]'), 
            toggleBreak = true, toggleCurrent = false, def = { active: 'active', content: 'content-active', break: toggleBreak}, attr = (opt) ? extend(def, opt) : def;

        NioApp.TGL.screen($contentD);

        $toggle.on('click', function(e){
            toggleCurrent = this;
            NioApp.Toggle.trigger($(this).data('target'), attr);
            e.preventDefault();
        });

        $doc.on('mouseup', function(e){
            if (toggleCurrent) {
                var $toggleCurrent = $(toggleCurrent);
                if (!$toggleCurrent.is(e.target) && $toggleCurrent.has(e.target).length===0 && !$contentD.is(e.target) && $contentD.has(e.target).length===0) {
                    NioApp.Toggle.removed($toggleCurrent.data('target'), attr);
                    toggleCurrent = false;
                }
            }
        });

        $win.on('resize', function(){
            $contentD.each(function(){
                var content = $(this).data('content'), ssize = $(this).data('toggle-screen'), toggleBreak = _break[ssize];
                if(NioApp.Win.width > toggleBreak){ 
                    NioApp.Toggle.removed(content, attr);
                } 
            });
        });
    };

    // ToggleExpand @v1.0
    NioApp.TGL.expand = function(elm, opt){
        var toggle = (elm) ? elm : '.expand', def = {toggle: true}, attr = (opt) ? extend(def, opt) : def;

        $(toggle).on('click', function(e){
            NioApp.Toggle.trigger($(this).data('target'), attr);
            e.preventDefault();
        });
    };

    // Dropdown Menu @v1.0
    NioApp.TGL.ddmenu = function(elm, opt){
        var imenu = (elm) ? elm : '.nk-menu-toggle',
            def = { active: 'active', self: 'nk-menu-toggle', child: 'nk-menu-sub'},
            attr = (opt) ? extend(def, opt) : def;

        $(imenu).on('click', function(e){
            if ((NioApp.Win.width < _break.lg) || ($(this).parents().hasClass(_sidebar) || $(this).parents().hasClass(_aside))) {
                NioApp.Toggle.dropMenu($(this), attr);
            }
            e.preventDefault();
        });
    };

    // Show Menu @v1.0
    NioApp.TGL.showmenu = function(elm, opt){
        var toggle = (elm) ? elm : '.nk-nav-toggle', $toggle = $(toggle), $contentD = $('[data-content]'),
            toggleBreak = ($body.hasClass(_short_nav) || $contentD.hasClass(_header_menu)) ? _break.lg : _break.xl,
            toggleOlay = _sidebar + '-overlay', toggleClose = {profile: true, menu: false}, 
            def = { active: 'toggle-active', content: _sidebar + '-active', body: 'nav-shown', overlay: toggleOlay, break: toggleBreak, close: toggleClose }, 
            attr = (opt) ? extend(def, opt) : def;

        $toggle.on('click', function(e){
            NioApp.Toggle.trigger($(this).data('target'), attr);
            e.preventDefault();
        });

        $doc.on('mouseup', function(e){
            if (!$toggle.is(e.target) && $toggle.has(e.target).length===0 && !$contentD.is(e.target) && $contentD.has(e.target).length===0 && NioApp.Win.width < toggleBreak) {
                NioApp.Toggle.removed($toggle.data('target'), attr);
            }
        });

        $win.on('resize', function(){
            if(NioApp.Win.width < _break.xl || NioApp.Win.width < toggleBreak ){ 
                NioApp.Toggle.removed($toggle.data('target'), attr);
            } 
        });
    };

    // DataTable @1.0
    NioApp.DataTable = function(elm, opt) {
        if ($(elm).exists()) {
            $(elm).each(function(){
                var auto_responsive = $(this).data('auto-responsive');
                var def = {
                        responsive: true,
                        autoWidth: false,
                        dom:'<"row justify-between g-2"<"col-7 col-sm-6 text-left"f><"col-5 col-sm-6 text-right"<"datatable-filter"l>>><"datatable-wrap my-3"t><"row align-items-center"<"col-7 col-sm-12 col-md-9"p><"col-5 col-sm-12 col-md-3 text-left text-md-right"i>>',
                        language: {
                            search : "",
                            searchPlaceholder: "Type in to Search",
                            lengthMenu: "<span class='d-none d-sm-inline-block'>Show</span><div class='form-control-select'> _MENU_ </div>",
                            info: "_START_ -_END_ of _TOTAL_",
                            infoEmpty: "No records found",
                            infoFiltered: "( Total _MAX_  )",
                            paginate: {
                                "first":      "First",
                                "last":       "Last",
                                "next":       "Next",
                                "previous":   "Prev"
                            },
                        }
                    }, 
                    attr = (opt) ? extend(def, opt) : def;
                    attr =(auto_responsive === false) ?  extend(attr, {responsive: false}) : attr;

                $(this).DataTable(attr);
            });
        }
    };

    // BootStrap Extended
    NioApp.BS.ddfix = function(elm, exc) {
        var dd = (elm) ? elm : '.dropdown-menu',
            ex = (exc) ? exc : 'a:not(.clickable), button:not(.clickable), a:not(.clickable) *, button:not(.clickable) *';

        $(dd).on('click', function (e) {
            if(!$(e.target).is(ex)){ 
                e.stopPropagation();
                return;
            }
        });
    }

    NioApp.Select2.init = function() {
        NioApp.Select2('.form-select');
    };

    // DataTable Init @v1.0
    NioApp.DataTable.init = function () {
        $.fn.DataTable.ext.pager.numbers_length = 7;
        NioApp.DataTable('.datatable-init', {
            responsive: {
                details: true
            }
        });
    }

    // Animate FormSearch @v1.0
    NioApp.Ani.formSearch= function(elm, opt){
        var def = {active: 'active', timeout: 400, target: '[data-search]'}, attr = (opt) ? extend(def, opt) : def;
        var $elem = $(elm), $target = $(attr.target);

        if($elem.exists()) {
            $elem.on('click', function(e){
                e.preventDefault();
                var $self = $(this), the_target = $self.data('target'),
                    $self_st = $('[data-search=' + the_target + ']'),
                    $self_tg = $('[data-target=' + the_target + ']');

                if(!$self_st.hasClass(attr.active)){
                    $self_tg.add($self_st).addClass(attr.active);
                    $self_st.find('input').focus();
                } else{
                    $self_tg.add($self_st).removeClass(attr.active);
                    setTimeout(function(){
                        $self_st.find('input').val('');
                    }, attr.timeout);
                }
            });

            $doc.on({
                keyup: function(e) {
                    if (e.key === "Escape") {
                        $elem.add($target).removeClass(attr.active);
                    }
                },
                mouseup: function(e){
                    if (!$target.find('input').val() && !$target.is(e.target) && $target.has(e.target).length===0 && !$elem.is(e.target) && $elem.has(e.target).length===0) {
                        $elem.add($target).removeClass(attr.active);
                    }
                }
            });
        }
    };

    NioApp.Ani.init = function() {
        NioApp.Ani.formSearch('.toggle-search');
    };


    // Extra @v1
    NioApp.OtherInit = function() {
        NioApp.ClassBody();
        NioApp.CurrentLink();
        NioApp.ClassNavMenu();
    };
    
    // BootstrapExtend Init @v1.0
    NioApp.BS.init = function() {
        NioApp.BS.menutip('a.nk-menu-link');
        NioApp.BS.tooltip('.nk-tooltip');
        NioApp.BS.tooltip('.btn-tooltip', {placement: 'top'});
        NioApp.BS.tooltip('[data-toggle="tooltip"]');
        NioApp.BS.tooltip('.tipinfo,.nk-menu-tooltip', {placement: 'right'});
        NioApp.BS.popover('[data-toggle="popover"]');
        NioApp.BS.progress('[data-progress]');
        NioApp.BS.modalfix();
        NioApp.BS.ddfix();
    }

    // Picker Init @v1.0
    NioApp.Picker.init = function() {
        NioApp.Picker.date('.date-picker');
        NioApp.Picker.dob('.date-picker-alt'); 
    };

    // Addons @v1
    NioApp.Addons.Init = function() {
        NioApp.Select2.init();
        NioApp.DataTable.init();
    };

    // Toggler @v1
    NioApp.TGL.init = function() {
        NioApp.TGL.content('.toggle');
        NioApp.TGL.expand('.toggle-expand'); 
        NioApp.TGL.expand('.toggle-opt', {toggle: false}); 
        NioApp.TGL.showmenu('.nk-nav-toggle');
        NioApp.TGL.ddmenu('.'+ _menu + '-toggle', {self: _menu + '-toggle', child: _menu + '-sub' }); 
    };

    NioApp.BS.modalOnInit = function() {
        $('.modal').on('shown.bs.modal', function () {
            NioApp.Select2.init();
        });

    };

    // Initial by default
    /////////////////////////////
    NioApp.init = function(){
        NioApp.coms.docReady.push(NioApp.OtherInit);
        NioApp.coms.docReady.push(NioApp.Prettify);
        NioApp.coms.docReady.push(NioApp.ColorBG);
        NioApp.coms.docReady.push(NioApp.ColorTXT);
        NioApp.coms.docReady.push(NioApp.TGL.init);
        NioApp.coms.docReady.push(NioApp.Ani.init);
        NioApp.coms.docReady.push(NioApp.BS.init);
        NioApp.coms.docReady.push(NioApp.Picker.init);
        NioApp.coms.docReady.push(NioApp.Addons.Init);
    }

    NioApp.init();

	return NioApp;
})(NioApp, jQuery);