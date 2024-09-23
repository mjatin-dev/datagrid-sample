import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import styles from "./styles.module.scss";

const Loading = ({ isInline, isSmall, height, alignment = "center" }) => {
  return (
    <div
      className={!isInline ? styles.loader : styles.loaderInline}
      style={{
        ...(height && { height }),
        ...(alignment && { justifyContent: alignment }),
      }}
    >
      <Loader
        type="Puff"
        color="#00BFFF"
        height={!isSmall ? 50 : 25}
        width={!isSmall ? 100 : 50}
      />
    </div>
  );
};

export default Loading;
