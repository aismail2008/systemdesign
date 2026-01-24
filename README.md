Open with draw.io

Option 1:
To use draw.io with GitHub, go to the following link: https://www.draw.io/?mode=github
You can either create a new diagram, or open an existing diagram.

Option 2:
intall locally on mac using this command
```brew install --cask drawio```
you can also downlaod from this link https://www.drawio.com/ or this link https://app.diagrams.net/?src=about

How to approach system design.
> (1) Requirments --> (2) Core Entities --> (3) API --> (4) High-level Design --> (5) Deep Dive 

-----
1) Requirments : 3 - 5 minuutes max

	[Function Req]: Min features for system. For example, for ticketing system:
	- Book tickets
	- view an event
	- search for events

	[Non-functional requirements]: Are your system quality.
	First ask yourself about CAP theorem but more related to system not generic like just saying consistency and/or availability
	Example:
	- Strong Consistency in booking tickets and high availability for search tickets
	- Read >> Write
	- Scalability

	[Assumptions and Out of Scope]
	- DBR
	- Fault Tolerance
	- Payment, 
	- etc

	[Calculations]
	refer to this section as long as you have some numbers to refer or build on 
-----
2) Core Entities: 2 minutes

Understanding data presisted in your system and exhanged between APIS.
For now it's enough to list entities not detailed attributes as it's early and will know them by dive deep later
For example in ticketing system:
- Events
- Venue
- Performer
- Ticket

3) APIs: 3 mintues

This depends if your ssytem has exposed APIs
Ex:
- GET /v1/event/:eventId -> returns event and venu and performere & ticket []
- GET /v1/search?term={term}&location{loc}&.... -> return parial<Event>[]

- POST /v1/booking/reserve
body{
	ticketId
}
- POST /v1/booking/confirm
body{
	ticketId
	paymentDetails(Stripe/Adyne)
}

-----
4). High-level Design 15-20 minutes

Purpose here is to satisify the functional requirmenets

-----
5). Deep Dive: Design 15 minutes

Purpose here is to satisify the non-functional requirmenets by revisiting your initial high-level design


