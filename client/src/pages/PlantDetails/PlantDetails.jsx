import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useState } from "react";
import { useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";

const PlantDetails = () => {
  const plant = useLoaderData();
  const { user } = useAuth();
  let [isOpen, setIsOpen] = useState(false);
  if (!plant || typeof plant !== "object") return <p>Sorry bro</p>;
  const { name, description, category, quantity, price, _id, seller, image } =
    plant || {};

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Container>
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <div className="w-full overflow-hidden rounded-xl">
              <img
                className="object-cover w-full"
                src={image}
                alt="header image"
              />
            </div>
          </div>
        </div>
        <div className="md:gap-10 flex-1">
          {/* Plant Info */}
          <Heading title={name} subtitle={`Category: ${category}`} />
          <hr className="my-6" />
          <div className="text-lg font-light text-neutral-500">
            {description}
          </div>
          <hr className="my-6" />

          <div
            className="
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              "
          >
            <div>Seller: {seller?.name}</div>

            <img
                className="w-10 h-10 rounded-full border border-lime-500 object-cover"
              alt="Avatar"
              referrerPolicy="no-referrer"
              src={seller?.image}
            />
          </div>
          <hr className="my-6" />
          <div>
            <p
              className="
                gap-4 
                font-light
                text-neutral-500
              "
            >
              Quantity: {quantity}
            </p>
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p className="font-bold text-3xl text-gray-500">Price: ${price}</p>
            <div>
              <Button
              disabled={!user}
                onClick={() => setIsOpen(true)}
                label={user ? "Purchase" : "login to purchase"}
              />
            </div>
          </div>
          <hr className="my-6" />

          <PurchaseModal
            plant={plant}
            closeModal={closeModal}
            isOpen={isOpen}
          />
        </div>
      </div>
    </Container>
  );
};

export default PlantDetails;
