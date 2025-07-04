@extends('layouts.admin.app')

@section('title', translate('category'))

@section('content')
    <div class="content container-fluid">
        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
            <h2 class="h1 mb-0">
                <img src="{{ dynamicAsset(path: 'public/assets/back-end/img/brand-setup.png') }}" class="mb-1 mr-1" alt="">
                @if($category['position'] == 1)
                    {{ translate('sub') }}
                @elseif($category['position'] == 2)
                    {{ translate('sub_Sub') }}
                @endif
                {{ translate('category') }}
                {{ translate('update') }}
            </h2>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="card">

                    <div class="card-body text-start">
                        <form action="{{ route('admin.category.update', [$category['id']]) }}" method="POST"
                              enctype="multipart/form-data">
                            @csrf
                            <div class="table-responsive w-auto overflow-y-hidden mb-4">
                                <div class="position-relative nav--tab-wrapper">
                                    <ul class="nav nav-pills nav--tab lang_tab" id="pills-tab" role="tablist">
                                        @foreach($languages as $lang)
                                        <li class="nav-item px-0">
                                            <a data-bs-toggle="pill" data-bs-target="#{{ $lang }}-form" role="tab" class="nav-link px-2 {{ $lang == $defaultLanguage ? 'active' : '' }}" id="{{ $lang }}-link">
                                                {{ getLanguageName($lang).'('.strtoupper($lang).')'}}
                                            </a>
                                        </li>
                                        @endforeach
                                    </ul>
                                    <div class="nav--tab__prev">
                                        <button class="btn btn-circle border-0 bg-white text-primary">
                                            <i class="fi fi-sr-angle-left"></i>
                                        </button>
                                    </div>
                                    <div class="nav--tab__next">
                                        <button class="btn btn-circle border-0 bg-white text-primary">
                                            <i class="fi fi-sr-angle-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-4">
                                <div
                                    class="{{ $category['parent_id']==0 || $category['position'] == 1 ? 'col-lg-6':'col-12' }}">
                                    <div class="h-100">
                                        <div class="tab-content" id="pills-tabContent">
                                            @foreach($languages as $lang)
                                                <div class="tab-pane fade {{ $lang == $defaultLanguage ? 'show active' : '' }}" id="{{ $lang }}-form" aria-labelledby="{{ $lang }}-link" role="tabpanel">
                                                        <?php
                                                        if (count($category['translations'])) {
                                                            $translate = [];
                                                            foreach ($category['translations'] as $t) {
                                                                if ($t->locale == $lang && $t->key == "name") {
                                                                    $translate[$lang]['name'] = $t->value;
                                                                }
                                                            }
                                                        }
                                                        ?>
                                                    <div class="form-group">
                                                        <label class="form-label">
                                                            {{ translate('category_Name') }} ({{strtoupper($lang) }})
                                                        </label>
                                                        <input type="text" name="name[]"
                                                            value="{{ $lang==$defaultLanguage?$category['name']:($translate[$lang]['name']??'') }}"
                                                            class="form-control"
                                                            placeholder="{{ translate('new_Category') }}" {{ $lang == $defaultLanguage? 'required':''}}>
                                                    </div>
                                                    <input type="hidden" name="lang[]" value="{{ $lang }}">
                                                    <input type="hidden" name="id" value="{{ $category['id']}}">
                                                </div>
                                            @endforeach
                                        </div>

                                        <div class="form-group">
                                            <label class="form-label" for="priority">{{ translate('priority') }}</label>
                                            <div class="select-wrapper">
                                                <select class="form-select" name="priority" id="" required>
                                                    @for ($index = 0; $index <= 10; $index++)
                                                        <option
                                                            value="{{ $index }}" {{ $category['priority']==$index?'selected':''}}>{{ $index }}</option>
                                                    @endfor
                                                </select>
                                            </div>
                                        </div>

                                        @if($category['parent_id']==0 || ($category['position'] == 1 && theme_root_path() == 'theme_aster'))
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-5 mt-lg-0 from_part_2">
                                    <div class="d-flex justify-content-center align-items-center bg-section rounded-8 p-20 w-100 h-100">
                                        <div class="d-flex flex-column gap-30">
                                            <div class="text-center">
                                                <label for="" class="form-label fw-semibold mb-1">
                                                    {{ translate('category_Logo') }}
                                                    <span class="text-danger">*</span>
                                                </label>
                                                <h4 class="mb-0"><span class="text-info-dark"> {{ THEME_RATIO[theme_root_path()]['Category Image'] }}</span></h4>
                                            </div>
                                            <div class="upload-file">
                                                <input type="file" name="image" id="category-image" class="upload-file__input single_file_input"
                                                    accept=".webp, .jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"  value="" >
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
                                                    <img class="upload-file-img" loading="lazy"
                                                        src="{{ getStorageImages(path: $category->icon_full_url , type: 'backend-basic') ?? '' }}"
                                                        data-default-src="{{ getStorageImages(path: $category->icon_full_url , type: 'backend-basic') ?? '' }}" alt="">
                                                </label>
                                                <div class="overlay">
                                                    <div class="d-flex gap-10 justify-content-center align-items-center h-100">
                                                        <button type="button" class="btn btn-outline-info icon-btn edit_btn">
                                                            <i class="fi fi-rr-camera"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p class="fs-12 mb-0 text-center">Image size : Max 2 MB</p>
                                        </div>
                                    </div>
                                </div>
                                @endif
                                @if($category['position'] == 2 || ($category['position'] == 1 && theme_root_path() != 'theme_aster'))
                                    <div class="d-flex justify-content-end gap-3">
                                        <button type="reset" id="reset" class="btn btn-secondary px-4">
                                            {{ translate('reset') }}
                                        </button>
                                        <button type="submit" class="btn btn-primary px-4">
                                            {{ translate('update') }}
                                        </button>
                                    </div>
                                @endif
                            </div>

                            @if($category['parent_id']==0 || ($category['position'] == 1 && theme_root_path() == 'theme_aster'))
                                <div class="d-flex justify-content-end gap-3">
                                    <button type="reset" id="reset"
                                            class="btn btn-secondary px-4">{{ translate('reset') }}</button>
                                    <button type="submit"
                                            class="btn btn-primary px-4">{{ translate('update') }}</button>
                                </div>
                            @endif
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
@endsection

@push('script')
    <script src="{{ dynamicAsset(path: 'public/assets/backend/admin/js/products/products-management.js') }}"></script>
@endpush
