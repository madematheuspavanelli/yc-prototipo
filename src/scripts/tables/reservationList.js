export default {
  headers: [
    {
      name: "message.name",
      property: "name",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    },
    {
      name: "message.reservationNumber",
      property: "reservationNumber",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    },
    {
      name: "message.wasPreCheckinMade",
      property: "preCheckin",
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
      width: 200
    },
    {
      name: "message.checkinMade",
      property: "checkinDate",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    },
    {
      name: "message.scheduledCheckout",
      property: "scheduledCheckout",
      orderBy: "asc",
      hasFilter: true,
      hasSorting: true,
      width: 200
    },
    {
      name: "message.checkoutMade",
      property: "checkoutDate",
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
      property: "name",
      width: 200
    },
    {
      property: "reservationNumber",
      width: 200
    },
    {
      property: "preCheckin",
      width: 200
    },
    {
      property: "scheduledCheckin",
      width: 200
    },
    {
      property: "checkinDate",
      width: 200
    },
    {
      property: "scheduledCheckout",
      width: 200
    },
    {
      property: "checkoutDate",
      width: 200
    },
    {
      property: "status",
      width: 200
    }
  ]
};
