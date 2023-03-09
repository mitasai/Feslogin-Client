import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
const Dropzone = forwardRef(({ imageUrl }, ref) => {
    const fileInputRef = useRef();
    const modalImageRef = useRef();
    const modalRef = useRef();
    const progressRef = useRef();
    const uploadRef = useRef();
    const uploadModalRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    const [message, setMessage] = useState("Drag & Drop files here or click to select file(s)");
    const [isUploadNew, setIsUploadNew] = useState(false);
    const [previewBackgroundImage, setPreviewBackgroundImage] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    useImperativeHandle(ref, () => ({
        uploadFiles: uploadFiles
    }));
    useEffect(() => {
        let filteredArr = selectedFiles.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        setValidFiles([...filteredArr]);
        if (imageUrl != null && imageUrl != "" && !isUploadNew) {
            setPreviewBackgroundImage(`url(${imageUrl})`);
        }
    }, [selectedFiles, previewBackgroundImage, imageUrl]);

    const preventDefault = (e) => {
        e.preventDefault();
        // e.stopPropagation();
    }

    const dragOver = (e) => {
        preventDefault(e);
    }

    const dragEnter = (e) => {
        preventDefault(e);
    }

    const dragLeave = (e) => {
        preventDefault(e);
    }

    const fileDrop = (e) => {
        preventDefault(e);
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const handleFiles = (files) => {
        if (validateFile(files[0])) {
            setIsUploadNew(true);
            setSelectedFiles(prevArray => [files[0]]);
            showImagePreview(files[0]);
        }
    }

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
        setErrorMessage("");
        if (validTypes.indexOf(file.type) === -1) {
            setErrorMessage("Tệp không hỗ trợ vui lòng chọn hình ảnh jpeg, png, jpg");
            return false;
        }
        if (fileSize(file.size) > 10) {
            setErrorMessage("Vui lòng chọn hình ảnh <= 10MB");
        }

        return true;
    }

    const fileSize = (size) => {
        if (size === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }


    const showImagePreview = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            setPreviewBackgroundImage(`url(${e.target.result})`);
        }
    }

    const closeModal = () => {
        modalRef.current.style.display = "none";
        modalImageRef.current.style.backgroundImage = 'none';
    }

    const uploadFiles = async (url, params) => {
        for (let i = 0; i < validFiles.length; i++) {
            const formData = new FormData();
            formData.append('file', validFiles[i]);
            for (let j = 0; j < params.length; j++) {
                formData.append(params[j].key, params[j].value);
            }
            axios.post(url, formData, {
                onUploadProgress: (progressEvent) => {
                    const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    if (uploadPercentage === 100) {
                    }
                },
            })
                .catch(() => {
                })
        }
    }
    return (
        <>
            <div className="img-placeholder position-relative mb-5" style={{ backgroundImage: previewBackgroundImage, backgroundPosition: "center" }}>
                <div className="drop-container"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={fileInputClicked}
                >
                    <div className="drop-message">
                        <div className="img-thumb">
                            {((errorMessage && errorMessage != "") || previewBackgroundImage == null || previewBackgroundImage == "") && <div>
                                <img
                                    className="img-fluid"
                                    src={"/assets/create-event/event-img-thumbnail.png"}
                                    alt=""
                                />
                                <div>{errorMessage && errorMessage != "" ? errorMessage : message} </div></div>}
                        </div>

                    </div>
                    <input
                        ref={fileInputRef}
                        className="file-input"
                        type="file"
                        multiple
                        onChange={filesSelected}
                    />
                </div>
            </div>
        </>
    );
});

export default Dropzone;
