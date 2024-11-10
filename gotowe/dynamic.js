import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// Wczytujemy dane z pliku JSON za pomocą SharedArray
const testData = new SharedArray("test data", function () {
  return JSON.parse(open("./dataPosts.json")); // Plik data.json zawiera dynamiczne dane
});

export let options = {
  vus: 1, // Liczba wirtualnych użytkowników
  iterations: 3, // Liczba iteracji
};

export default function () {
  // Wybieramy losowy element z tablicy `testData`
  const randomData = testData[Math.floor(Math.random() * testData.length)];

  // Przygotowanie treści żądania POST
  const url = "https://jsonplaceholder.typicode.com/posts";
  const payload = JSON.stringify({
    title: randomData.title,
    body: randomData.body,
    userId: randomData.userId,
  });

  // Wysyłamy żądanie POST
  let res = http.post(url, payload);

  // Sprawdzamy, czy odpowiedź spełnia oczekiwane warunki
  check(res, {
    "status was 201": (r) => r.status === 201, // Sprawdza, czy kod statusu to 201
    "response has id": (r) => JSON.parse(r.body).id !== undefined, // Sprawdza, czy odpowiedź zawiera pole `id`
  });

  const post = res.json();
  console.log("Post ID: " + post.id);

  sleep(1); // Opóźnienie między żądaniami
}
