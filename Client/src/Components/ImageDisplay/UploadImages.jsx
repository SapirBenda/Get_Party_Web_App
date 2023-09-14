import { useState } from "react";
import React from "react";
import Button from "@material-ui/core/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Stack, Typography } from "@mui/material";
import Carousel from "react-elastic-carousel";
import DeleteIcon from "@mui/icons-material/Delete";
import { p, s } from "../General/Theme";

let dic = {};

const UploadImages = ({
  selectedFiles,
  setSelectedFiles,
  limit = false,
  label,
  height = "180px",
  roundView = false,
  urls = [],
  setUrls = null,
}) => {
  const [selectedImages, setSelectedImages] = useState(urls);
  const onSelectFile = (event) => {
    const selectedFilesFromUser = event.target.files;
    const selectedFilesArray = Array.from(selectedFilesFromUser);

    let newFilesArray;
    if (limit === true) {
      newFilesArray = selectedFilesArray.slice(0, 1);
      setUrls && setUrls(null);
    } else {
      newFilesArray = selectedFilesArray;
    }
    const imagesArray = newFilesArray.map((file) => {
      const url = URL.createObjectURL(file);
      dic[url] = file;
      return url;
    });

    setSelectedFiles((previousFiles) =>
      limit ? newFilesArray : [...previousFiles, ...newFilesArray]
    );
    setSelectedImages((previousImages) =>
      limit ? imagesArray : [...previousImages, ...imagesArray]
    );
  };

  const onDeleteImage = (image) => {
    if (image in dic) {
      const deletedFile = dic[image];
      setSelectedFiles(
        selectedFiles.filter((file) => file?.name !== deletedFile?.name)
      );
    } else {
      setUrls(urls.filter((img) => img !== image));
    }
    setSelectedImages(selectedImages.filter((img) => img !== image));
  };

  return (
    <>
      <Stack direction="column" alignItems="center" spacing={3} width="100%">
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="center"
        >
          <label>
            <form>
              <input
                type="file"
                name="images"
                id="image_upload"
                onChange={onSelectFile}
                multiple={!limit}
                accept="image/*"
                hidden
              />
            </form>
            <Button
              variant="outlined"
              component="span"
              style={{ color: p, borderColor: p }}
            >
              <PhotoCamera style={{ color: p }} />
              <Typography
                ml={1.5}
                variant="cardFont"
                color={p}
                style={{ textTransform: "none" }}
              >
                {label}{" "}
              </Typography>
            </Button>
          </label>
        </Stack>
        <Stack direction="row" width="70%" justifyContent="center">
          {selectedImages?.length > 1 ? (
            <Carousel>
              {selectedImages?.map((image, index) => {
                return (
                  <Stack gap={2} alignItems="center">
                    <Typography variant="cardFont">
                      Image Number {index + 1}
                    </Typography>
                    <img src={image} height={height} alt="upload" />
                    <Button onClick={() => onDeleteImage(image)}>
                      <DeleteIcon style={{ color: "red" }} />
                    </Button>
                  </Stack>
                );
              })}
            </Carousel>
          ) : (
            selectedImages?.length === 1 &&
            selectedImages?.map((image, index) => {
              return (
                <Stack gap={2} alignItems="center">
                  <img
                    src={image}
                    height={height}
                    alt="upload"
                    style={{
                      borderRadius: roundView ? "10%" : 0,
                      border: `solid 2px ${s}`,
                    }}
                  />
                  <Button onClick={() => onDeleteImage(image)}>
                    <DeleteIcon style={{ color: "red" }} />
                  </Button>
                </Stack>
              );
            })
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default UploadImages;
