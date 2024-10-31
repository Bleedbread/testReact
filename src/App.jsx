import {  useRef } from "react";

import "./App.css";

function App() {



  const img = useRef();


  const onClick = () => {
    camera().then(() => {
      return picker();
    })
    .then((rs) => {
      return upload(rs.fullpath)
    })
    .then((rs) => {
      img.current.src = rs.fullpath
    })
    
  };
  const camera = () => {
    return new Promise((resolve, reject) => {
      M.media.camera({
        path: "/media",
        mediaType: "PHOTO",
        saveAlbum: true,
        callback: function (status, result) {
          if (status == "SUCCESS") {
            resolve(result);
          } else {
            reject();
          }
        },
      });
    });
  };

  const picker = () => {
    return new Promise((resolve, reject) => {
      M.media.picker({
        mode: "SINGLE",
        media: "ALL",
        // path: "/media",
        column: 3,
        callback: function (status, result) {
          if (status === "SUCCESS") {
            resolve(result);
          } else {
            reject();
          }
        },
      });
    });
  };

  const upload = (file) => {
    return new Promise((resolve, reject) => {
      M.net.http.upload({
        url: "http://10.0.2.2:3000/file/upload",
        header: {},
        params: {},
        body: [{ name: "file", content: file, type: "FILE" }],
        encoding: "UTF-8",
        finish: function (status, header, body) {
          if(status ==200) {
            const json = JSON.parse(body)
            resolve(json)
          } else {
            reject({status, header, body})
          }
        },
        progress: function (total, current) {
          console.log(total, current);
        },
      });
    });
  };
  return (
    <>
      <h1 onClick={onClick}>카메라 촬영 / 이미지 선택 / 업로드 이미지 확인</h1>
      <img style={{width: 100}} ref={img} />
    </>
  );
}
export default App;