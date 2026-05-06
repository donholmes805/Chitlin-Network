export const generateStaticParams = () => [{ episodeId: 'default' }];

import WatchClient from "./WatchClient";


export default function Page() {
  return <WatchClient />;
}
