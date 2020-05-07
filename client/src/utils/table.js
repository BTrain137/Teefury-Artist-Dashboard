import axios from "axios";
import { justDate } from "./cleanData";

export const fetchComForTable = async (reqBody, token) => {
  const request = {
    ...reqBody,
    headers: { Authorization: `JWT ${token}` },
  };

  try {
    const {
      data: { commissionsDetailsArr },
    } = await axios(request);

    const convertDetailsForAdmin = commissionsDetailsArr.map((details) => {
      const { order_created_at, commissions_paid, ...otherProperty } = details;
      return {
        ...otherProperty,
        order_created_at: justDate(order_created_at),
        commissions_paid: commissions_paid ? "Paid" : "Unpaid",
      };
    });

    return convertDetailsForAdmin;
  } catch (error) {
    throw error;
  }
};
