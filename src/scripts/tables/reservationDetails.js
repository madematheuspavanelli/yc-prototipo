export default {
  headers: [
    {
      name: "message.reservationNumber",
      property: "reservationNumber",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    },
    {
      name: "message.scheduledCheckin",
      property: "scheduledCheckin",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 250
    },
    {
      name: "message.checkinMade",
      property: "checkinDate",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 250
    },
    {
      name: "message.scheduledCheckout",
      property: "scheduledCheckout",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 250
    },
    {
      name: "message.checkoutMade",
      property: "checkoutDate",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 250
    },
    {
      name: "message.checkoutPrice",
      property: "checkoutPrice",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    },
    {
      name: "message.reservationStatus",
      property: "status",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    }
  ],
  columns: [
    {
      property: "reservationNumber",
      width: 200
    },
    {
      property: "scheduledCheckin",
      width: 250
    },
    {
      property: "checkinDate",
      width: 250
    },
    {
      property: "scheduledCheckout",
      width: 250
    },
    {
      property: "checkoutDate",
      width: 250
    },
    {
      property: "checkoutPrice",
      width: 200
    },
    {
      property: "status",
      width: 200
    }
  ]
};
