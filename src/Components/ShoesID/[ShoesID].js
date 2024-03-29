import "./ShoesID.css";

import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError, notifyWarn } from "../toastify-popup";

const ShoesID = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let value = location.state.data;

  const [sizeChosen, setSizeChosen] = useState("");
  const [user, setUser] = useState(null);

  const userRef = doc(
    db,
    "users",
    auth.currentUser ? auth.currentUser.email : "guest"
  );

  const userSnap = getDoc(userRef);

  useEffect(() => {
    userSnap.then((res) => {
      setUser(res.data());
    });
  }, []);

  const AddToBag = async () => {
    if (user) {
      // User is signed in
      if (sizeChosen !== "") {
        const userBagRef = doc(
          collection(
            db,
            "users",
            auth.currentUser ? auth.currentUser.email : "guest",
            "bag"
          )
        );

        await setDoc(userBagRef, {
          // shoes data set to the user bag
          name: value?.name.name,
          price: value?.price.price,
          color: value?.color.color,
          details: value?.details.details,
          shoesID: value?.shoesID.shoesID,
          imgurl: value?.imgurl.imgurl,
          size: sizeChosen,
          docID: userBagRef.id,
        }).catch((error) => {
          notifyError("An error have occured");
          console.log(error);
        });
        setSizeChosen("");

        notifySuccess("👟 " + [value?.name.name] + " added to bag!");
      } else {
        notifyWarn("You did not select a size for your shoes");
      }
    } else {
      // User is signed out
      navigate("/signin");
    }
  };

  return (
    <div className="shoesID__page">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
      <img
        className="shoesID_img"
        src={value?.imgurl.imgurl}
        alt={value?.imgurl.imgurl}
      />

      <section className="shoesID__section">
        <span className="shoesID__section_name">{value?.name.name}</span>

        <span className="shoesID__section_border" />

        <span className="shoesID__section_price">{value?.price.price}$</span>

        <ul>
          <li>
            <span>color: {value?.color.color}</span>
          </li>
          <li>
            <span>{value?.details.details}</span>
          </li>
        </ul>

        <span className="shoesID__section_sizes">
          <span className="shoesID__section_sizes_span">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>

                <Select
                  sx={{ padding: 0 }}
                  value={sizeChosen}
                  label="Size"
                  onChange={(e) => {
                    setSizeChosen(e.target.value);
                  }}
                >
                  {value.sizes.sizes.map((size, index) => {
                    return (
                      <MenuItem key={index} value={size}>
                        {size}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </span>
        </span>

        {/* if user exists return btn else null */}
        {auth.currentUser ? (
          <button onClick={AddToBag} className="shoesID__section_addtobag_btn">
            ADD TO BAG
          </button>
        ) : null}
      </section>
    </div>
  );
};

export default ShoesID;
