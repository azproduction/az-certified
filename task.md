# Certification webapp

## Background

I conducted a theoretical part of my masterclass and I want to assess my student's understanding of the content. 

As a result I want to give them a virtual certificate in Silver Gold and Platinum levels. It was 4h lecture with 200 slides.


## App

I want to build a happy looking quiz MCQ app. As a result it should give a certificate in Silver, Gold or Platinum rank. Or participant might fail the test.

From provided bank of questions select 50(critical must be included).

## Critical items

Always include all of them.

Failing >=2 of these items => automatic fail, regardless of total score

## Ratios

```
{
  "suggested_thresholds":{"Silver_percent":60,"Gold_percent":80,"Platinum_percent":95}
}
```

## Screens

- Name input (persisted in local storage)
- Quiz flow
  - Include progress bar with a counter
  - Align quiz in the center
  - Do not tell if answer was correct or not
  - Participants can revisit any questions and change answer
  - Time limit to one hour
- Failure 
- Certificate page
  - Each grade should have different style 
  - Should mention their name and number of correct answers 
  - should look cool so people want to share result
  - use svg for frame
  - give an option to download a 9x16 image with a certificate picture for instagram story (LATER)

## Tech requirements

- Mobile friendly
- Simple and minimalistic design
- Statically built Next.js app
- Should be able to deploy to github pages
- React 19
- Styled components for CSS
- Latest Typescript.
- Zod for every non trusted data (local storage)