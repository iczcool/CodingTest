import TicketService from "./src/pairtest/TicketService.js";
const ticketService = new TicketService();
const accountId = 10;

console.log("How many tickets do you want to purchase?");
const tickets = 10; //get total tickets to purchase
console.log("What type of ticket do you want to purchase?");
//get type of ticket
let type = "CHILD";
console.log("How many?");
//get num of tickets to purchase at a time
let numOfTickets = 2;

ticketService.purchaseTickets(accountId, tickets, type, numOfTickets);