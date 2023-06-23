// SETTINGS
import Vue from "vue";
import VueRouter from "vue-router";
import Settings from "@/views/Settings.vue";
import SettingsFaceCamera from "@/components/settings/FaceCamera";
import SettingsDocumentCamera from "@/components/settings/DocumentCamera";
import HotelSettings from "@/components/settings/HotelSettings";
import LanguageSettings from "@/components/settings/Languages";

// START PROCESS
import Home from "@/components/pages/Home";
import Checkin from "@/components/pages/Checkin";
// import StartProcess from "@/components/StartProcess";
import ErrorConfig from "@/components/ErrorConfig";
import FaceRecognition from "@/components/FaceRecognition";
// import PersonalForm from "@/components/form/PersonalForm";
import PersonalForm from "@/components/pages/Checkin/PersonalForm";
// import AddressForm from "@/components/form/AddressForm";
import AddressForm from "@/components/pages/Checkin/AddressForm";
import DataConfirmation from "@/components/form/DataConfirmation";
import CardRegistration from "@/components/payment/CardRegistration";

// CHECKIN
// import Checkin from "@/views/Checkin.vue";
import EndCheckin from "@/components/checkin/EndCheckin.vue";
// import InvoicePage from "@/components/payment/InvoicePage.vue";
import InvoicePage from "@/components/pages/payment/Invoice.vue";
import DisagreeInvoice from "@/components/payment/DisagreeInvoice.vue";
import KeyConfig from "@/components/form/KeyConfig.vue";
import CovidForm from "@/components/form/CovidForm.vue";
import CheckinPage from "@/components/checkin/CheckinPage.vue";
import PaymentPage from "@/components/payment/PaymentPage.vue";
// import Signature from "@/components/payment/Signature.vue";
import Signature from "@/components/pages/payment/Signature.vue";
import DocumentPage from "@/components/checkin/DocumentPage.vue";
import SelectGuestPage from "@/components/checkin/SelectGuestPage.vue";

// CHECKOUT
import Checkout from "@/views/Checkout.vue";
import SavedCard from "@/components/payment/SavedCard.vue";
import EndCheckout from "@/components/checkout/EndCheckout.vue";
import CheckoutPage from "@/components/checkout/CheckoutPage.vue";
import ReturnKeys from "@/components/checkout/ReturnKeys.vue";

// PRECHECKIN
import PreCheckin from "@/views/PreCheckin.vue";
import StartPreCheckin from "@/components/precheckin/StartPreCheckin.vue";
import RegisterGuest from "@/components/precheckin/RegisterGuest.vue";
import SelfieGuest from "@/components/precheckin/SelfieGuest.vue";
import DocumentPic from "@/components/precheckin/DocumentPic.vue";
import Personal from "@/components/precheckin/Personal.vue";
import Address from "@/components/precheckin/Address.vue";
import EndPreCheckin from "@/components/precheckin/EndPreCheckin.vue";
import CardPreRegistration from "@/components/precheckin/CardPreRegistration.vue";

// ADMIN
import Admin from "@/views/Admin.vue";
import AdminContent from "@/views/AdminContent.vue";
import Login from "@/components/admin/Login.vue";
import Dashboard from "@/components/admin/Dashboard";
import Reservations from "@/views/Reservations.vue";
import ReservationList from "@/components/admin/ReservationList.vue";
import Reservation from "@/components/admin/Reservation.vue";
import Guests from "@/views/Guests.vue";
import GuestList from "@/components/admin/GuestList.vue";
import Guest from "@/components/admin/Guest.vue";
import AdminSettings from "@/views/AdminSettings.vue";
import PreCheckinSettings from "@/components/admin/PreCheckinSettings.vue";
import TotemSettings from "@/components/admin/TotemSettings.vue";
import OptionalSettings from "@/components/admin/OptionalSettings.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/recognition",
    name: "Recognition",
    component: FaceRecognition
  },
  {
    path: "/errorConfig",
    name: "ErrorConfig",
    component: ErrorConfig
  },
  {
    path: "/payment/card",
    name: "CardRegistration",
    component: CardRegistration
  },
  {
    path: "/payment/invoice",
    name: "InvoicePage",
    component: InvoicePage
  },
  {
    path: "/payment/disagree",
    name: "DisagreeInvoice",
    component: DisagreeInvoice
  },
  {
    path: "/payment/paymentPage",
    name: "PaymentPage",
    component: PaymentPage
  },
  {
    path: "/payment/signature",
    name: "Signature",
    component: Signature
  },
  {
    path: "/personal",
    name: "PersonalForm",
    component: PersonalForm
  },
  {
    path: "/address",
    name: "AddressForm",
    component: AddressForm
  },
  {
    path: "/checkin",
    name: "Checkin",
    component: Checkin,
    children: [
      {
        path: "/checkin/guestPage",
        name: "SelectGuestPage",
        component: SelectGuestPage
      },
      {
        path: "/checkin/documentPage",
        name: "DocumentPage",
        component: DocumentPage
      },
      // {
      //   path: "/checkin/personal",
      //   name: "PersonalForm",
      //   component: PersonalForm
      // },
      // {
      //   path: "/checkin/address",
      //   name: "AddressForm",
      //   component: AddressForm
      // },
      {
        path: "/checkin/covid",
        name: "CovidForm",
        component: CovidForm
      },
      {
        path: "/checkin/dataConfirmation",
        name: "DataConfirmation",
        component: DataConfirmation
      },
      {
        path: "/checkin/CheckinPage",
        name: "CheckinPage",
        component: CheckinPage
      },
      {
        path: "/checkin/keyConfig",
        name: "KeyConfig",
        component: KeyConfig
      },
      {
        path: "/checkin/end",
        name: "EndCheckin",
        component: EndCheckin
      }
    ]
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
    children: [
      {
        path: "/payment/savedCard",
        name: "SavedCard",
        component: SavedCard
      },
      {
        path: "/checkout/checkoutPage",
        name: "CheckoutPage",
        component: CheckoutPage
      },
      {
        path: "/checkout/returnKeys",
        name: "ReturnKeys",
        component: ReturnKeys
      },
      {
        path: "/checkout/end",
        name: "EndCheckout",
        component: EndCheckout
      }
    ]
  },
  {
    path: "/preCheckin",
    component: PreCheckin,
    redirect: "/preCheckin/start",
    children: [
      {
        path: "/preCheckin/start",
        name: "StartPreCheckin",
        component: StartPreCheckin
      },
      {
        path: "/preCheckin/register",
        name: "RegisterGuest",
        component: RegisterGuest
      },
      {
        path: "/preCheckin/selfie",
        name: "SelfieGuest",
        component: SelfieGuest
      },
      {
        path: "/preCheckin/document",
        name: "DocumentPic",
        component: DocumentPic
      },
      {
        path: "/preCheckin/Personal",
        name: "Personal",
        component: Personal
      },
      {
        path: "/preCheckin/Address",
        name: "Address",
        component: Address
      },
      {
        path: "/preCheckin/payment",
        name: "CardPreRegistration",
        component: CardPreRegistration
      },
      {
        path: "/preCheckin/end",
        name: "EndPreCheckin",
        component: EndPreCheckin
      }
    ]
  },
  {
    path: "/admin",
    component: Admin,
    children: [
      {
        path: "login",
        name: "Login",
        component: Login
      },
      {
        path: "/",
        component: AdminContent,
        name: "AdminContent",
        redirect: "/admin/reservations",
        children: [
          {
            path: "dashboard",
            name: "Dashboard",
            component: Dashboard
          },
          {
            path: "reservations",
            name: "ReservationsList",
            component: Reservations,
            redirect: "/admin/reservations/listing",
            children: [
              {
                path: "listing",
                name: "ReservationListing",
                component: ReservationList
              },
              {
                path: ":reservationId",
                name: "Reservation",
                component: Reservation
              }
            ]
          },
          {
            path: "guests",
            name: "Guests",
            redirect: "/admin/guests/listing",
            component: Guests,
            children: [
              {
                path: "listing",
                name: "GuestsListing",
                component: GuestList
              },
              {
                path: ":guestId",
                name: "Guest",
                component: Guest
              }
            ]
          },
          {
            path: "settings",
            name: "AdminSettings",
            redirect: "/admin/settings/precheckin",
            component: AdminSettings,
            children: [
              {
                path: "precheckin",
                name: "PreCheckinSettings",
                component: PreCheckinSettings
              },
              {
                path: "totem",
                name: "Totem",
                component: TotemSettings
              },
              {
                path: "optionals",
                name: "Optional",
                component: OptionalSettings
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    redirect: "/settings/facecamera",
    children: [
      {
        name: "FaceCamera",
        path: "facecamera",
        component: SettingsFaceCamera
      },
      {
        name: "DocumentCamera",
        path: "documentcamera",
        component: SettingsDocumentCamera
      },
      {
        name: "HotelSettings",
        path: "hotelsettings",
        component: HotelSettings
      },
      {
        name: "LanguageSettings",
        path: "languagesettings",
        component: LanguageSettings
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
