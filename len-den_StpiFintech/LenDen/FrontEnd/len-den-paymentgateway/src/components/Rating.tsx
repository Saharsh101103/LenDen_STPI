'use client'
import { Rating } from "react-simple-star-rating";

export default function ClientRating() {
  return <Rating
    initialValue={5}
    readonly
    size={20}
    emptyStyle={{ display: "flex" }}
    fillStyle={{ display: "-webkit-inline-box" }}
  />
}