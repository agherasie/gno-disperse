import { FC } from "react";
import DisperseForm from "../organisms/DisperseForm";
import DisperseHeader from "../organisms/DisperseHeader";
import DisperseTypeSelect from "../organisms/DisperseTypeSelect";
import { useAccountStore } from "../store";

const Home: FC = () => {
  const { account } = useAccountStore();

  return (
    <div className="p-10 md:p-20 xl:p-30 w-full lg:w-2/3 xl:w-1/2 m-auto">
      <div className="space-y-8">
        <DisperseHeader />
        {account && (
          <>
            <DisperseTypeSelect />
            <DisperseForm />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
