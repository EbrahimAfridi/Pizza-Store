import Button from "../../ui/Button.jsx";
import {useFetcher} from "react-router-dom";
import {updateOrder} from "../../services/apiRestaurant.js";

function UpdateOrder({order}){
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "submitting";
  console.log(isLoading + " loading")

  return(
    <fetcher.Form method="PATCH" className="text-right">
      <Button disabled={isLoading} type="primary">
        { isLoading ? "Submitting..." : "Make order primary" }
      </Button>
    </fetcher.Form>
  )
}

export default UpdateOrder;

export async function action({request, params}){
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}