const _redactor = {
    inited: [],

    imperavi: function(id)
    {
        // $R.options = {
        //     buttonsTextLabeled: true
        // };

        $R(`#${id}`, getSettings.imperavi({
            styles: true,
            // mode: 'htmlmixed'
        }));
    },

    quill: function(id)
    {
        // var BackgroundClass = Quill.import('attributors/class/background');
        // var ColorClass = Quill.import('attributors/class/color');
        // var SizeStyle = Quill.import('attributors/style/size');
        // Quill.register(BackgroundClass, true);
        // Quill.register(ColorClass, true);
        // Quill.register(SizeStyle, true);

        const element = $(`#${id}-container`).get(0);

        const editor = new Quill(element, getSettings.quill());

        editor.on('text-change', function() {
            $(`#${id}`).val(editor.root.innerHTML);
        });
    },

    tinymce: function(id)
    {
        tinymce.init(getSettings.tinymce({
            selector: `#${id}`
        }));
    },

    cleditor: function(id)
    {
        $(`#${id}`).cleditor();
    },

    froala: function(id)
    {
        $(`#${id}`).froalaEditor(getSettings.tinymce({
            heightMin: 200
        }));
    },

    summernote: function(id)
    {
        $(`#${id}`).summernote({
            height: 200,
            tabsize: 2,
            toolbar: true,
            codemirror: {
                theme: 'monokai'
            }
        });
    },

    ckeditor5: function(id)
    {
        ClassicEditor.create(document.querySelector(`#${id}`), {
            // language: 'ru',
            toolbar: [ 'heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', 'blockQuote' ],
            alignment: {
                toolbar: [ 'alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify' ],
                options: [ 'left', 'right', 'center', 'justify' ]
            },
            fontSize: {
                options: [
                    'tiny',
                    'small',
                    'default',
                    'big',
                    'huge'
                ]
                // options: [ 9, 10, 11, 12, 13, 14, 15 ]
            },
            highlight: {
                options: [
                    {
                        model: 'yellowMarker',
                        class: 'marker-yellow',
                        title: 'Yellow marker',
                        color: 'var(--ck-highlight-marker-yellow)',
                        type: 'marker'
                    },
                    {
                        model: 'greenMarker',
                        class: 'marker-green',
                        title: 'Green marker',
                        color: 'var(--ck-highlight-marker-green)',
                        type: 'marker'
                    },
                    {
                        model: 'pinkMarker',
                        class: 'marker-pink',
                        title: 'Pink marker',
                        color: 'var(--ck-highlight-marker-pink)',
                        type: 'marker'
                    },
                    {
                        model: 'blueMarker',
                        class: 'marker-blue',
                        title: 'Blue marker',
                        color: 'var(--ck-highlight-marker-blue)',
                        type: 'marker'
                    },
                    {
                        model: 'redPen',
                        class: 'pen-red',
                        title: 'Red pen',
                        color: 'var(--ck-highlight-pen-red)',
                        type: 'pen'
                    },
                    {
                        model: 'greenPen',
                        class: 'pen-green',
                        title: 'Green pen',
                        color: 'var(--ck-highlight-pen-green)',
                        type: 'pen'
                    }
                ]
            },
            image: {
                toolbar: [ 'imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative' ],
                styles: [
                    { name: 'left', icon: 'left' },
                    { name: 'center', icon: 'center' },
                    { name: 'right', icon: 'right' },
                    { name: 'fullSize', title: 'Full size', icon: 'right', isDefault: true },
                    { name: 'side', icon: 'left', title: 'My side style', class: 'custom-side-image' }
                ]
            },
            ckfinder: {
                uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
            }
        })
        .catch(error => {
            console.log( error );
        });
    },

    ckeditor: function(id)
	{
        CKEDITOR.config.width = 'auto';
        CKEDITOR.config.height = 600;
        CKEDITOR.disableAutoInline = true;

        // CKEDITOR.replace(id, {
        //     toolbar: [
        //         { name: 'document', items: [ 'Print' ] },
        //         { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
        //         { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
        //         { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting' ] },
        //         { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        //         { name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        //         { name: 'links', items: [ 'Link', 'Unlink' ] },
        //         { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
        //         { name: 'insert', items: [ 'Image', 'Table' ] },
        //         { name: 'tools', items: [ 'Maximize' ] },
        //         { name: 'editing', items: [ 'Scayt' ] }
        //     ],
        //     customConfig: '',
        //     disallowedContent: 'img{width,height,float}',
        //     extraAllowedContent: 'img[width,height,align]',
        //     // extraPlugins: 'tableresize,uploadimage,uploadfile',
        //     extraPlugins: 'tableresize',
        //     height: 800,
        //     contentsCss: [ 'https://cdn.ckeditor.com/4.6.1/full-all/contents.css' ],
        //     bodyClass: 'document-editor',
        //     format_tags: 'p;h1;h2;h3;pre',
        //     removeDialogTabs: 'image:advanced;link:advanced',
        //     stylesSet: [
        //         /* Inline Styles */
        //         { name: 'Marker', element: 'span', attributes: { 'class': 'marker' } },
        //         { name: 'Cited Work', element: 'cite' },
        //         { name: 'Inline Quotation', element: 'q' },
        //         /* Object Styles */
        //         {
        //             name: 'Special Container',
        //             element: 'div',
        //             styles: {
        //                 padding: '5px 10px',
        //                 background: '#eee',
        //                 border: '1px solid #ccc'
        //             }
        //         },
        //         {
        //             name: 'Compact table',
        //             element: 'table',
        //             attributes: {
        //                 cellpadding: '5',
        //                 cellspacing: '0',
        //                 border: '1',
        //                 bordercolor: '#ccc'
        //             },
        //             styles: {
        //                 'border-collapse': 'collapse'
        //             }
        //         },
        //         { name: 'Borderless Table', element: 'table', styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
        //         { name: 'Square Bulleted List', element: 'ul', styles: { 'list-style-type': 'square' } }
        //     ]
        // } );

        CKEDITOR.replace(id, {
            customConfig: '/static/apps/wysiwyg/ckeditor/config.js'
        });
	},

    wysiwyg: function(id)
	{
		$(`#${id}`).wysiwyg({
			toolbar: 'top', // 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
            hotKeys: {
                'ctrl+b meta+b': 'bold',
                'ctrl+i meta+i': 'italic',
                'ctrl+u meta+u': 'underline',
                'ctrl+z meta+z': 'undo',
                'ctrl+y meta+y meta+shift+z': 'redo'
            }
		});
	},

	init: function(id, type)
	{
		if (typeof(this[type]) !== 'undefined')
		{
            if (this.inited.indexOf(id) < 0) {
                this.inited.push(id)
                this[type](id);
            }
		}
	}
};