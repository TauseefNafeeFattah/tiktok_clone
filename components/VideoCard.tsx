import React, { useState, useEffect, useRef} from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsPlay, BsFillPlayFill, BsFillPauseFill} from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import Video from '../types';
import LikeButton from './LikeButton';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { BASE_URL } from '../utils';
import { FaCommentDots } from 'react-icons/fa';
import {FaShare} from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { useRouter } from 'next/router';

import {
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from "next-share";

interface IProps {
  posts: Video;
}

const VideoCard: NextPage<IProps> = ({ posts }) =>{
  const [post, setPost] = useState(posts);
  const autofocusQuery = true
  const [isHover, setIsHover] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const { userProfile }: any = useAuthStore();
  const [showShareDialogue, setShowShareDialogue] = useState(false);
  const router = useRouter();
  const sameUser = (userProfile._id == post.postedBy._id);
  const onVideoPress = () => {
    if(playing){
      videoRef?.current?.pause();
      setPlaying(false);
    }
    else{
      videoRef?.current?.play();
      setPlaying(true);
    }
  }

  useEffect(() => {
    if(videoRef?.current){
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted])

  const handleLike = async (like: boolean) => {
    console.log(post._id)
    if(userProfile){
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like
      })

      setPost({ ...post, likes: data.likes});
      console.log(post)
    }
  }
  const handleEdit = () => {
    router.push(`/search/${searchValue}`)
  }
  const handleDelete = async() => {

    if(userProfile && post){
      const {data} = await axios.delete(
        `${BASE_URL}/api/delete/${post._id}`
      )
      router.push(`/profile/${userProfile._id}`)
    }
  }

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
          <div className="md:w-16 w-10 h-10">
            <Link href={`/profile/${post?.postedBy._id}`}>
              <>
                <Image
                  width={62}
                  height={62}
                  src={post?.postedBy.image}
                  className="rounded-full"
                  alt="profile photo"
                  layout="responsive"
                />
              </>
            </Link>
          </div>
          <div className="flex flex-row">
            <Link href={`/profile/${post?.postedBy._id}`}>
              <div className="flex flex-col gap-2">
                <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                  {post?.postedBy.userName}{' '}
                  <GoVerified className="text-blue-400 text-md"/>
                </p>
              </div>
            </Link>
            { sameUser ? (
              <div  className="flex flex-row gap-4 ml-52 place-content-end">
                <div className="hover:text-red-500" onClick={() => handleDelete()}>
                  Delete
                </div>
                <div>|</div>
                <Link href ={`/edit/${post._id}`}>
                  <div className="hover:text-blue-500">
                    Edit
                  </div>
                </Link>
              </div>
            ):(
              <div></div>
            )}

          </div>

        </div>
      </div>

      <div className="lg:ml-24 flex gap-4 relative">
        <div
          onMouseEnter ={() => setIsHover(true)}
          onMouseLeave ={() => setIsHover(false)}
          className="rounded-3xl"
        >
          <Link href ={`/detail/${post._id}`}>
            <div>
              <p className="mt-3 mb-3 cursor-pointer font-semibold ml-2">{post.caption.slice(0, 50)}{post.caption.length > 50 && <p className="text-s text-gray-500">  ...showmore</p>}</p>
              <video
                loop
                ref={videoRef}
                className="lg:w-[600px] h-[150px] md:h-[250px] lg:h-[350px] w-[200px] rounded-2xl cursor-pointer bg-gray-100"
                src={post.video.asset.url}
              >
              </video>
            </div>
          </Link>
          {isHover && (
            <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3">
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-white text-2xl lg:text-4xl"/>
                </button>
              ):(
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-white text-2xl lg:text-4xl"/>
                </button>
              )}
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
          )}
        </div>
      </div>

      {userProfile ? (
        <div className="flex flex-row gap-24 justify-center items-center px-5">
          <div className="mt-1">
            <LikeButton
              likes={post.likes}
              handleLike={() => handleLike(true)}
              handleDislike={() => handleLike(false)}
            />
          </div>
          <Link href ={`/detail/${post._id}/?autofocusQuery=${true}`}>
            <div>
              <FaCommentDots className="mb-1 cursor-pointer" color="black" fontSize={21} />
            </div>
          </Link>
          <div>
            <FaShare onClick={()=>setShowShareDialogue(!showShareDialogue)} className="mb-1 cursor-pointer" color="black" fontSize={21} />
          </div>

        </div>

      ):(
        <div>
          Please login to like the post
        </div>
      )}

      {showShareDialogue && (
        <div className="flex flex-row gap-6 justify-center items-center border-t-2 border-gray-200 pt-4">
          <FacebookShareButton
            url={`/detail/${post._id}`}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton
            url={`/detail/${post._id}`}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <RedditShareButton
            url={`/detail/${post._id}`}
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
          <WhatsappShareButton
            url={`/detail/${post._id}`}
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <MdOutlineCancel onClick={()=>setShowShareDialogue(false)} color="red" fontSize={32}/>
        </div>
      )}
    </div>
  )
}

export default VideoCard
