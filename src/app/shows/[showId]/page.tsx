export const generateStaticParams = () => [{ showId: 'default' }];

import ShowClient from "./ShowClient";


export default function Page() {
  return <ShowClient />;
}
