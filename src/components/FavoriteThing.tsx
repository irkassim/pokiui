import { useState } from "react";

  interface Favorite {
    category: string;
    value: string;
  }
  
  const FavoriteThing = ({ user, handleUpdateFavorite }: { user: any; handleUpdateFavorite: (favorite: Favorite) => void }) => {
    const [tempFavorite, setTempFavorite] = useState<Favorite>({
      category: user.favorite?.category || 'song',
      value: user.favorite?.value || '',
    });
  
    const [selectedCategory, setSelectedCategory] = useState<Favorite>({
      category: user.favorite?.category || 'song',
      value: '',
    });
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const categories = ['song', 'movie', 'series', 'celebrity', 'book', 'politician', 'thing'];
  
    const openModal = () => setIsModalOpen(true);
  
    const closeModal = () => {
      setTempFavorite({
        category: user.favorite?.category || 'song',
        value: user.favorite?.value || '',
      });
  
      setSelectedCategory({
        category: user.favorite?.category || 'song',
        value: '',
      });
  
      setIsModalOpen(false);
    };
  
    const saveFavorite = () => {
      handleUpdateFavorite(tempFavorite);
      closeModal();
    };
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Your Favorite Right Now</h2>
        <div className="flex flex-wrap gap-2 justify-start items-center mt-2 mb-4 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory({ category, value: tempFavorite.value })
              }
              className={`py-2 px-4 rounded-full ${
                selectedCategory.category === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
  
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content p-4">
              <h3 className="text-lg font-bold">
                {`Your favorite ${selectedCategory.category}`}
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
                placeholder={`Enter your favorite ${selectedCategory.category}`}
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
  
        <div className="mt-4">
          <button onClick={openModal} className="px-4 py-2 bg-green-500 text-white rounded-md">
            Edit Favorite
          </button>
        </div>
      </div>
    );
  };
  
  export default FavoriteThing;
  