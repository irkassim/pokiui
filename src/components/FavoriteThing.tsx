import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/Constants";

interface Favorite {
  category: string;
  value: string;
}

const FavoriteThing = ({
  user,
  handleUpdateFavorite,
}: {
  user: any;
  handleUpdateFavorite: (favorite: Favorite) => void;
}) => {
  const [tempFavorite, setTempFavorite] = useState<Favorite>({
    category: user.favorite?.category || "",
    value: user.favorite?.value || "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);


  // Sync with user data when the user changes
  useEffect(() => {
    setTempFavorite({
      category: user.favorite?.category || "",
      value: user.favorite?.value || "",
    });
  }, [user]);

  const openModal = (category: string) => {
    setTempFavorite((prevFavorite) => ({
      category,
      value: prevFavorite.category === category ? prevFavorite.value : "",
    }));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTempFavorite({
      category: user.favorite?.category || "",
      value: user.favorite?.value || "",
    });
    setIsModalOpen(false);
  };

  const saveFavorite = () => {
    handleUpdateFavorite(tempFavorite);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Favorite Right Now</h2>
      <div className="flex flex-wrap gap-2 justify-start items-center mt-2 mb-4 px-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => openModal(category)}
            className={`py-2 px-4 rounded-full ${
              tempFavorite.category === category ||
              user.favorite?.category === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display selected value */}
      {user.favorite?.value && (
        <p className="text-gray-600">
          Your favorite {user.favorite?.category}:{" "}
          <span className="font-bold text-blue-500">
            {user.favorite?.value}
          </span>
        </p>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content p-4">
            <h3 className="text-lg font-bold">
              {`Your favorite ${tempFavorite.category}`}
            </h3>
            <input
              type="text"
              value={tempFavorite.value}
              onChange={(e) =>
                setTempFavorite({
                  ...tempFavorite,
                  value: e.target.value,
                })
              }
              className="border p-2 w-full rounded-md mt-2"
              placeholder={`About your favorite ${tempFavorite.category}`}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveFavorite}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteThing;
