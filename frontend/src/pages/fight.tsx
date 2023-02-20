import { useRouter } from "next/router";

const Fight = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>{id}</div>;
};

export default Fight;
