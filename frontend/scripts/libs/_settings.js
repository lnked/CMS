const getSettings = {
    merge (a1, a2) {
        return Object.assign({}, a1, a2);
    },

    trix (combine) {
        return this.merge(combine, {
            smartyVersion  : 3,
            continueComments: "Enter"
        });
    },

    quill (combine) {
        const toolbarOptions = [
            ['code-block'],

            [{ 'font': [] }],

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

            ['blockquote'],

            [{ 'header': 1 }, { 'header': 2 }],

            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
        ];

        return this.merge(combine, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow',
            placeholder: 'Содержимое блока...'
        });
    },

    froala (combine) {
        return this.merge(combine, {
            language: 'ru',
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            pluginsEnabled: null
        });
    },

    Ckeditor5 (combine) {
        return this.merge(combine, {});
    },

    imperavi (combine) {
        return this.merge(combine, {
            lang: 'ru',

            plugins: [
                'clips', 'beyondgrammar', 'alignment',
                'widget', 'video', 'textexpander',
                'table', 'specialchars', 'properties', 'pagebreak', 'limiter',
                'inlinestyle', 'imagemanager', 'handle', 'fullscreen', 'fontsize',
                'fontfamily', 'fontcolor', 'filemanager', 'definedlinks', 'counter'
            ],

            toolbarFixed: true,

            imagePosition: true,

            imageResizable: true,

            toolbarFixedTopOffset: 10,

            // air: true,

            // buttonsTextLabeled: true,

            fileUpload: '/api/upload/file',

            imageUpload: '/api/upload/image',

            clipboardUploadUrl: '/api/upload/clipboard'
        });
    },

    summernote (combine) {
        // var element = document.querySelector("trix-editor")
        // element.editor  // is a Trix.Editor instance

        return this.merge(combine, {
            smartyVersion  : 3,
            continueComments: "Enter"
        });

        // $('#summernote').summernote({
        //     lang: 'ru-RU'
        //     height: 300,                 // set editor height
        //     minHeight: null,             // set minimum height of editor
        //     maxHeight: null,             // set maximum height of editor
        //     focus: true                  // set focus to editable area after initializing summernote
        // });
    },

    codemirror (combine) {
        return this.merge(combine, {
            gutters: ["note-gutter", "CodeMirror-linenumbers"],
            tabSize: 4,
            indentUnit: 4,
            lineNumbers: true,
            lineWrapping: true,
            tabMode: "indent",
            autofocus: false,
            smartIndent: false,
            enterMode: "keep",
            smartyVersion  : 3,
            continueComments: "Enter"
        });
    },

    tinymce (combine) {
        return this.merge(combine, {
            selector: 'textarea',
            height: 70,
            theme: 'modern',
            plugins: 'searchreplace directionality visualblocks visualchars fullscreen link image media codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount imagetools colorpicker textpattern',
            toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
            menubar: false,
            fullpage: false,
            remove_script_host: false,
            relative_urls: false,
            image_advtab: true,
            content_css: [
                '/static/apps/wysiwyg/tinymce/codepen.min.css'
            ]
        });
    }
}
