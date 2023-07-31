import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #id; 
  #totalTickets;
  #ticketType;
  #numOfTickets;
  purchaseTickets(accountId, tickets, type, numOfTickets) {
    // throws InvalidPurchaseException

    this.#id = accountId;
    this.#totalTickets = tickets;
    this.#ticketType = type;
    this.#numOfTickets = numOfTickets;
   
    this.#purchaseFunc(this.totalTickets);    
  }

  #purchaseFunc(totalTickets){
    const maxTickets = 20; //maximum number of tickets
    let {amountOfTickets, numOfSeats} = 0;
    const [totalAmountOfTickets, totalSeats, typeArr] = this.#loopFunc(this.#ticketType, this.#numOfTickets, amountOfTickets, numOfSeats, this.#totalTickets);
    let paymentException = new InvalidPurchaseException(typeArr);
   
    if (!paymentException.validatePurchase()) {
      console.log("Sorry! Child and Infant tickets cannot be purchased without purchasing an Adult ticket");
    } else{
      //make a payment request to the TicketPaymentService
      this.#ticketPaymentService(this.#id, totalAmountOfTickets);
      //makes a seat reservation request to the SeatReservationService
      this.#seatReservationService(this.#id, totalSeats);
    }
  }

  #ticketPaymentService(id, amount){
    let paymentgateway = new TicketPaymentService();
    try {
      paymentgateway.makePayment(id, amount);
      console.log("Ticket payment successful");
      console.log("Total Amount Of Tickets: £" + amount + "\n");
    } catch (error) {
      console.log(error);
    }
  }

  #seatReservationService(id, seats){
    try {
      let seatbooking = new SeatReservationService();
      seatbooking.reserveSeat(id, seats);
      console.log("Seat reservation successful");
      console.log("Number of seats reserved: " + seats);
    } catch (error) {
      console.log(error);
    }
  }

  #loopFunc(ticketType, numOfTickets, amountOfTickets, numOfSeats, totalTickets){
    let totalAmountOfTickets = 0; //overall amount at final purchase 
    let totalSeats = 0; //final total number of seats to request
    let count = 0;
    let typeArr = [];

    do {
      let ticketTypeRequest = new TicketTypeRequest(ticketType, numOfTickets);
      ticketType = ticketTypeRequest.getTicketType();
      numOfTickets = ticketTypeRequest.getNoOfTickets();
      
      //calculate tickets and seats
      if (ticketType === "ADULT") {
        amountOfTickets = numOfTickets * 20;
        numOfSeats = numOfTickets;
        typeArr.push(ticketType);
      }
      else if(ticketType === "CHILD"){
        amountOfTickets = numOfTickets * 10;
        numOfSeats = numOfTickets;
        typeArr.push(ticketType);
      }
      else if(ticketType === "INFANT"){
        amountOfTickets = numOfTickets * 0;
        numOfSeats = 0;
        typeArr.push(ticketType);
      }

      totalAmountOfTickets += amountOfTickets; 
      totalSeats += numOfSeats;
      count += numOfTickets;
    } while (count < totalTickets);
    return [totalAmountOfTickets, totalSeats, typeArr];
  }
}
