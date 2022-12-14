import React, { useState, useEffect } from 'react';
import { MdFavorite } from 'react-icons/md';

import useAuthStore from '../store/authStore';

interface IProps {
  handleLike: () => void;
  handleDislike: () => void;
  likes: any[];
}

const LikeButton = ({likes, handleLike, handleDislike}: IProps) => {
  const [liked, setLiked] = useState(false);
  const { userProfile }: any = useAuthStore();
  const filterLikes = likes?.filter((item) => item._ref === userProfile?._id)
  useEffect(() => {
    if (filterLikes?.length > 0){
      setLiked(true);
    }else{
      setLiked(false);
    }
  }, [filterLikes, likes])

  return (
    <div className = "flex gap-6 mb-5 mt-2">
      <div className="flex flex-row gap-3 justify-center items-center cursor-pointer">
        {liked ? (
          <div className=" rounded-full py-2  text-[#F51997]" onClick={handleDislike}>
            <MdFavorite className="text-lg md:text-2xl" />
          </div>
        ):(
          <div className=" rounded-full py-2 text-black" onClick={handleLike}>
            <MdFavorite className="text-lg md:text-2xl" />
          </div>
        )}
        <p className="text-md font-semibold">
          {likes?.length || 0}
        </p>
      </div>
    </div>
  )
}

export default LikeButton;
