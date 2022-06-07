import { BookingBusinesses, BookingCurrencies, IBookingBusinesses, IBookingCurrencies } from "./types.js";
import { GraphFI } from "../fi.js";

export {
    BookingCurrencies,
    BookingCurrency,
    BookingBusinesses,
    BookingBusiness,
    BookingAppointments,
    BookingAppointment,
    BookingCustomers,
    BookingCustomer,
    BookingServices,
    BookingService,
    BookingStaffMembers,
    BookingStaffMember,
    IBookingBusinessAddResult,
    IBookingAppointmentAddResult,
    IBookingCustomerAddResult,
    IBookingServiceAddResult,
    IBookingStaffMemberAddResult,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly bookingBusinesses: IBookingBusinesses;
        readonly bookingCurrencies: IBookingCurrencies;
    }
}

Reflect.defineProperty(GraphFI.prototype, "bookingBusinesses", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(BookingBusinesses);
    },
});

Reflect.defineProperty(GraphFI.prototype, "bookingCurrencies", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(BookingCurrencies);
    },
});