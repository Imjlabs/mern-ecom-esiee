import React, { Fragment, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Alert, reviewSubmitHanlder } from "./Action";
import { LayoutContext } from "../layout";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const ReviewForm = () => {
  const { data, dispatch } = useContext(LayoutContext);
  let { id } = useParams();

  const [fData, setFdata] = useState({
    rating: "",
    review: "",
    error: false,
    success: false,
    pId: id,
  });

  if (fData.error || fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, error: false, success: false });
    }, 3000);
  }

  const fetchData = async () => {
    try {
      let responseData = await getSingleProduct(id);
      if (responseData.Product) {
        dispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
        console.log(data);
      }
      if (responseData.error) {
        console.log(responseData.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ratingUserList = data.singleProductDetail.pRatingsReviews.map(
    (item) => {
      return item.user ? item.user._id : "";
    }
  );

  return (
    <Fragment>
      <div className="md:mx-16 lg:mx-20 xl:mx-24 flex flex-col">
        {fData.error ? Alert("red", fData.error) : ""}
        {fData.success ? Alert("green", fData.success) : ""}
      </div>
      {ratingUserList.includes(isAuthenticate().user._id) ? (
        <div className="mb-12 md:mx-16 lg:mx-20 xl:mx-24"></div>
      ) : (
        <div className="mb-12 md:mx-16 lg:mx-20 xl:mx-24 flex flex-col">
          <div className="flex flex-col space-y-2">
            <span className="text-2xl font-medium">Ajouter un commentaire</span>
            <span className="text-gray-600 text-sm">
            Votre adresse email ne sera pas publiée. Les champs obligatoires sont
            marqué par un *
            </span>
          </div>
          <div className="mb-4">
            <fieldset
              onChange={(e) => setFdata({ ...fData, rating: e.target.value })}
              className="rating"
            >
              <input
                type="radio"
                className="rating"
                id="star5"
                name="rating"
                defaultValue={5}
              />
              <label
                className="full"
                htmlFor="star5"
                title="Parfait !"
              />
              <input
                type="radio"
                className="rating"
                id="star4"
                name="rating"
                defaultValue={4}
              />
              <label
                className="full"
                htmlFor="star4"
                title="Très bien"
              />
              <input
                type="radio"
                className="rating"
                id="star3"
                name="rating"
                defaultValue={3}
              />
              <label className="full" htmlFor="star3" title="Bien" />
              <input
                type="radio"
                className="rating"
                id="star2"
                name="rating"
                defaultValue={2}
              />
              <label
                className="full"
                htmlFor="star2"
                title="Correct"
              />
              <input
                type="radio"
                className="rating"
                id="star1"
                name="rating"
                defaultValue={1}
              />
              <label
                className="full"
                htmlFor="star1"
                title="Mauvais"
              />
            </fieldset>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="textArea">
                Commentaire <span className="text-sm text-gray-600">*</span>
              </label>
              <textarea
                onChange={(e) => setFdata({ ...fData, review: e.target.value })}
                value={fData.review}
                className="border px-4 py-2 focus:outline-none"
                name="textArea"
                id="textArea"
                cols={30}
                rows={3}
                placeholder="Ecriver ici votre commentaire..."
              />
            </div>
            <div
              onClick={(e) => reviewSubmitHanlder(fData, setFdata, fetchData)}
              style={{ background: "#303031" }}
              className="inline-block rounded px-4 py-2 text-white text-center cursor-pointer"
            >
              Commenter
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ReviewForm;
