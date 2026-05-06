export const generateStaticParams = () => [{ channelId: 'default' }];

import ChannelClient from "./ChannelClient";


export default function Page() {
  return <ChannelClient />;
}
