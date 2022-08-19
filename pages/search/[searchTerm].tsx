import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GoVerified } from 'react-icons/go';
import axios from 'axios';
import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video} from '../../types';
import { BASE_URL } from '../../utils';
import useAuthStore from '../../store/authStore';

const Search = ({ videos }: { videos: Video[] }) => {
  const [showVideos, setshowVideos] = useState(true);
  const isVideos = showVideos ? 'border-b-2 border-black': 'text-gray-400'
  const isAccounts = !showVideos ? 'border-b-2 border-black': 'text-gray-400'
  const router = useRouter();
  const { searchTerm }: any = router.query;
  const { allUsers } = useAuthStore();
  const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`} onClick={() => setshowVideos(true)}>
          Videos
        </p>
        <p className={`text-xl font-semibold cursor-pointer mt-2 ${isAccounts}`} onClick={() => setshowVideos(false)}>
          Accounts
        </p>
      </div>
      {showVideos ? (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            videos.map((post: Video, idx: number) => (
              <VideoCard post={post} key={idx} />
            ))
          ) : (
            <NoResults text={`No Video Results for ${searchTerm}`} />
          )}
        </div>
      ): (
        <div className="md:mt-16">
          {searchedAccounts.length ? (
            searchedAccounts.map((user:IUser, idx:number) =>(
              <Link href={`/profile/${user._id}`} key={idx}>
                <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                  <div>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="user profile"
                    />
                  </div>
                  <div className="hidden xl:block">
                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                      {user.userName.replaceAll(' ','')}
                      <GoVerified className="text-blue-400" />
                    </p>
                    <p className="capitalize text-gray-400 text-xs">
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ):(
            <NoResults text={`No Account Results for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  )
}
export default Search;

export const getServerSideProps = async ({
  params: { searchTerm }
}:{
  params: { searchTerm: string }
}) => {
  const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)
  return {
    props: { videos: res.data }
  }
}
