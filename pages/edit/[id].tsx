import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { SanityAssetDocument } from '@sanity/client';
import useAuthStore from '../../store/authStore';
import { client } from '../../utils/client';
import { topics } from '../../utils/constants';
import { BASE_URL } from '../../utils';
import { BsFillPlayFill} from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff} from 'react-icons/hi';

interface IProps {
  postDetails: Video,
}

const Edit = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const [caption, setCaption] = useState(post.caption);
  const [category,setCategory] = useState(post.topic);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);


  const onVideoClick = () => {
    if(playing){
      videoRef?.current?.pause();
      setPlaying(false);
    }
    else{
      videoRef?.current?.play();
      setPlaying(true);
    }
  }


  const handlePost = async () => {
    if(caption && category){

      await axios.put(`${BASE_URL}/api/edit`, {
        postId: post._id,
        caption,
        topic:category
      });

      router.push('/');
    }
  }

  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center">
      <div className="bg-white rounded-lg xl:h-[80vh] w-[60%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6">
        <div>
          <div>
            <p className="text-2xl font-bold">
              Edit Video
            </p>
            <p className="text-md text-gray-400 mt-1">
              Edit and Post a video to your account
            </p>
          </div>
          <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center">

            <div className="relative">
              <div className="lg:h-[100vh] h-[50vh]">
                <video
                  ref={videoRef}
                  loop
                  onClick={onVideoClick}
                  src={post.video.asset.url}
                  className="h-full cursor-pointer"
                >
                </video>
              </div>

              <div className="absolute top-[45%] left-[45%] cursor-pointer">
                {!playing && (
                  <button onClick={onVideoClick}>
                    <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
                  </button>
                )}
              </div>
            </div>

            <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-white text-2xl lg:text-4xl"/>
                </button>
              ):(
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-white text-2xl lg:text-4xl"/>
                </button>
              )}
            </div>
          </div>

        </div>
        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => {setCaption(e.target.value)}}
            className="rounded outline-none text-md border-2 border-gray-200 p-2"
          />
          <label className="text-md font-medium">Choose a Category </label>
          <select
            onChange={(e) => {setCategory(e.target.value)}}
            className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
          >
            {topics.map((topic) => (
              <option
                key={topic.name}
                className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                value={topic.name}
              >
                {topic.name}
              </option>
            ))}
          </select>
          <div className="flex gap-6 mt-10">
            <button
              onClick={() => {}}
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              type="button"
              className="bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Edit;

export const getServerSideProps = async ({
  params: { id }
}:{
  params: { id: string }
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)
  return {
    props: { postDetails: data }
  }
}
