<div class="card bg-body shadow-lg mt-3">
    <div class="card-body">
        <h2 class="text-primary text-uppercase mb-3">Single Images</h2>
        <h3 class="text-primary mb-3">1/1 Images</h3>
        <div class="row g-4">
            <div class="col-lg-6">
                <h3 class="text-success mb-3">normal</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                        <label
                            class="upload-file__wrapper">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(1:1)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(1:1)</span></p>
                </div>
            </div>
       </div>
        <h3 class="text-primary my-3">2/1 Images</h3>
        <div class="row g-4">
            <div class="col-lg-6">
                <h3 class="text-success mb-3">normal</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                        <label
                            class="upload-file__wrapper ratio-2-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(2:1)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper ratio-2-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(2:1)</span></p>
                </div>
            </div>
       </div>
       <h3 class="text-primary my-3">3/1 Images</h3>
        <div class="row g-4">
            <div class="col-lg-6">
                <h3 class="text-success mb-3">normal</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                        <label
                            class="upload-file__wrapper ratio-3-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(3:1)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper ratio-3-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(3:1)</span></p>
                </div>
            </div>
       </div>
       <h3 class="text-primary my-3">7/1 Images</h3>
        <div class="row g-4">
            <div class="col-lg-6">
                <h3 class="text-success mb-3">normal</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                        <label
                            class="upload-file__wrapper ratio-7-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(7:1)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper ratio-7-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(7:1)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with view and delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper ratio-7-1">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn view_btn">
                                    <i class="fi fi-sr-eye"></i>
                                </button>
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(7:1)</span></p>
                </div>
            </div>
       </div>
       <h3 class="text-primary my-3">Custom Width Images</h3>
        <div class="row g-4">
            <div class="col-lg-6">
                <h3 class="text-success mb-3">normal</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                        <label
                            class="upload-file__wrapper w-260">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(260 x 100 px)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper w-325">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(325 x 100 px)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-danger mb-3">with view and delete button</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper w-325">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn view_btn">
                                    <i class="fi fi-sr-eye"></i>
                                </button>
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(325 x 100 px)</span></p>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="text-success mb-3">Image modal with buttons</h3>
                <div class="d-flex flex-column gap-20">
                    <div>
                        <label for="" class="form-label fw-semibold mb-1">
                            Upload Specialty Image
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your Specialty Image</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            accept=".webp, .jpg, .jpeg, .png, .gif"  value="" required>
                            <button type="button" class="remove_btn btn btn-danger btn-circle w-20 h-20 fs-8">
                                <i class="fi fi-sr-cross"></i>
                            </button>
                        <label
                            class="upload-file__wrapper w-325">
                            <div class="upload-file-textbox text-center">
                                <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                <h6 class="mt-1 fw-medium lh-base text-center">
                                    <span class="text-info">{{ translate('Click to upload') }}</span>
                                    <br>
                                    {{ translate('or drag and drop') }}
                                </h6>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn view_btn">
                                    <i class="fi fi-sr-eye"></i>
                                </button>
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG, Gif Image size : Max 2 MB <span class="fw-medium">(325 x 100 px)</span></p>
                </div>
            </div>
       </div>
       <h3 class="text-primary my-3">Textbox align change</h3>
        <div class="row g-4">
            <div class="col-lg-6">
                <h3 class="text-success mb-3">normal</h3>
                <div class="d-flex flex-column gap-20 bg-section p-12 p-sm-20">
                    <div>
                        <label for="mail-logo" class="form-label fw-semibold mb-1">
                            {{translate('Icon')}}
                            <span class="text-danger">*</span>
                        </label>
                        <p class="fs-12 mb-0">Upload your new restaurant registration icon.</p>
                    </div>
                    <div class="upload-file">
                        <input type="file" name="thumbnail" class="upload-file__input single_file_input"
                            name="logo" id="mail-logo" data-image-id="view-mail-logo"
                            accept=".webp, .jpg, .jpeg, .png"  value="" required>
                        <label
                            class="upload-file__wrapper ratio-3-1">
                            <div class="upload-file-textbox text-center">
                                <div class="d-flex gap-2 align-items-center justify-content-center flex-wrap">
                                    <img width="34" height="34" class="svg" src="{{dynamicAsset(path: 'public/assets/new/back-end/img/svg/image-upload.svg')}}" alt="image upload">
                                    <h6 class="mt-1 fw-medium lh-base text-center">
                                        <span class="text-info">{{ translate('Click to upload') }}</span>
                                        <br>
                                        {{ translate('or drag and drop') }}
                                    </h6>
                                </div>
                            </div>
                            <img class="upload-file-img" loading="lazy" src="" data-default-src="" alt="">
                        </label>
                        <div class="overlay">
                            <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                    <i class="fi fi-rr-camera"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="fs-10 mb-0 text-center">JPG, JPEG, PNG Less Than 1MB <span class="fw-medium">(Ratio 3:1)</span></p>
                </div>
            </div>
       </div>
    </div>
</div>