//封装获取频道列表的逻辑

import { useEffect, useState } from "react";
import { http } from "@/utils";
function useChannel(){
    //获取频道列表所有的逻辑
    const [channelList, setChannelList] = useState([])
    useEffect(() => {
        async function fetchChannels() {
          const res = await http.get("/channels");
          setChannelList(res.data.channels);
        }
        fetchChannels();
      }, []);
    //把组件中要用到的数据return出去
    return {channelList}

}
export {useChannel}