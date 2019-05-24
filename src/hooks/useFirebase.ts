import React, { useState, useEffect } from "react";
import { firebase } from "../firebase/firebase";

const useFirebase = (collection: string, doc: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const db = firebase.firestore();
    const unsub = db
      .collection(collection)
      .doc(doc)
      .onSnapshot(querySnapshot => {
        setData(querySnapshot.data() || {});
        setLoading(false);
      });
    return () => {
      unsub();
    };
  });

  return [loading, data];
};
