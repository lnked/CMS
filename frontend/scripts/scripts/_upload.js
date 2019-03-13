$(document).ready(function(){

   $.upload = {
        open: function(selector, isClearErr, isResetForm, isOverlay)
        {
            clearInterval(uploadOpenTimeout);
            uploadOpenTimeout = setTimeout(function() {
                upload._open(selector, isClearErr, isResetForm, isOverlay);
            }, 200);
        },
        clearErrors: function($upload) {
            $upload.find('.error').removeClass('error');
            $upload.find('.upload__errorList').addClass('hide').empty();
            $upload.find('.hide-on-open').hide();
            $upload.find('.tooltip').remove();
        }
    };

    $.upload.init = function() {
        let formAction = `/${ADMIN_DIR}/meta/fileUpload`;
        let filesLimit = 0;

        $('.js-fileupload').each((index, item) => {
            return ((element) => {
                const $attachments = $(element);
                const id = $attachments.find('.js-fileupload-control').attr('id');

                const groupid = $attachments.find('.js-fileupload-group').val();
                const settings = $attachments.find('.js-fileupload-settings').val();
                const input_name = $attachments.find('.js-fileupload-group').attr('name');

                if ($attachments.data('action'))
                {
                    formAction = $attachments.data('action');
                }

                const uploader = new qq.FineUploader({
                    debug: false,

                    multiple: true,

                    element: document.getElementById(id),

                    template: 'upload-template',

                    request: {
                        accessKey: "file_key",
                        endpoint: formAction,
                        inputName: 'file',
                        includeExif: false,
                        defaultQuality: 100,
                        params: {
                            groupid: groupid,
                            settings: settings
                        }
                    },

                    deleteFile: {
                        enabled: true,
                        forceConfirm: false,
                        endpoint: `/${ADMIN_DIR}/meta/filedelete`
                    },

                    thumbnails: {
                        placeholders: {
                            waitingPath: `/${ADMIN_DIR}/images/fine-uploader/waiting-generic.png`,
                            notAvailablePath: `/${ADMIN_DIR}/images/fine-uploader/not_available-generic.png`
                        }
                    },

                    validation: {
                        // allowedExtensions: ['jpeg', 'jpg', 'png', 'gif', 'txt'],
                        itemLimit: filesLimit,
                        sizeLimit: 2048000
                    },

                    callbacks: {
                        onComplete: function(id, name, response) {
                            this.setUuid(id, response.id);
                        }
                    }
                });

                console.log(initialFiles[groupid] || []);

                uploader.addInitialFiles(initialFiles[groupid] || []);

                $attachments.on('click', '.qq-upload-file-selector', function(e) {
                    e.preventDefault();
                    const title = $(this).text();
                    const index = $(this).closest('.attachments-list__item').index();
                    const id = uploader.getUuid(index);

                    const update = Module.changeFileName(id, title);

                    if (update) {
                        uploader.setName(index, update);
                    }
                });

            })(item);
        });
    };
});