"use strict";
$(function () {
    let getMultipleImageData = $("#get-multiple-image-data");
    let getMultipleImageText = $("#get-multiple-image-text");
    $(".select-multiple-image").spartanMultiImagePicker({
        fieldName: getMultipleImageData.data("field"),
        maxCount: parseInt(getMultipleImageData.data("max-count")),
        rowHeight: getMultipleImageData.data("row-height"),
        groupClassName: getMultipleImageData.data("group-class"),
        maxFileSize: "",
        placeholderImage: {
            image: getMultipleImageData.data("image"),
            width: getMultipleImageData.data("width"),
        },
        dropFileLabel: "Drop Here",
        onAddRow: function (index, file) {},
        onRenderedPreview: function (index) {},
        onRemoveRow: function (index) {},
        onExtensionErr: function () {
            toastMagic.error(getMultipleImageText.data("on-extension-err"));
        },
        onSizeErr: function () {
            toastMagic.error(getMultipleImageText.data("on-size-err"));
        },
    });
});

let selectedFiles = [];
$(document).on("ready", () => {
    $("#message-file-array").on("change", function () {
        for (let index = 0; index < this.files.length; ++index) {
            selectedFiles.push(this.files[index]);
        }
        displaySelectedFiles();
    });

    function displaySelectedFiles() {
        const container = document.getElementById("selected-files-container");
        container.innerHTML = "";
        selectedFiles.forEach((file, index) => {
            const input = document.createElement("input");
            input.type = "file";
            input.name = `image[${index}]`;
            input.classList.add(`image_index${index}`);
            input.hidden = true;
            container.appendChild(input);
            const blob = new Blob([file], { type: file.type });
            const file_obj = new File([file], file.name);
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file_obj);
            input.files = dataTransfer.files;
        });
        let fileArray = $(".filearray");
        fileArray.empty();
        for (let index = 0; index < selectedFiles.length; ++index) {
            let filereader = new FileReader();
            let $uploadDiv = jQuery.parseHTML(
                "<div class='upload_img_box'><span class='img-clear'><i class='fi fi-rr-cross-small'></i></span><img src='' alt=''></div>"
            );

            filereader.onload = function () {
                $($uploadDiv).find("img").attr("src", this.result);
                let imageData = this.result;
            };

            filereader.readAsDataURL(selectedFiles[index]);
            fileArray.append($uploadDiv);
            $($uploadDiv)
                .find(".img-clear")
                .on("click", function () {
                    $(this).closest(".upload_img_box").remove();
                    selectedFiles.splice(index, 1);
                    $(".image_index" + index).remove();
                });
        }
    }
});
