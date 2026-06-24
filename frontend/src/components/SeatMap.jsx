export default function SeatMap({ seats, selectedSeatIds, onToggleSeat, rows }) {
  const seatsByRow = {};
  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  const rowNumbers = rows || Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);

  return (
    <div>
      <div className="screen-label">— SCREEN —</div>
      <div className="seat-map">
        {rowNumbers.map((row) => (
          <div key={row} className="seat-row">
            {(seatsByRow[row] || []).map((seat) => {
              const isBooked = seat.status === "booked";
              const isSelected = selectedSeatIds.includes(seat.id);
              let className = "seat";
              if (isBooked) className += " booked";
              if (isSelected) className += " selected";

              return (
                <button
                  key={seat.id}
                  type="button"
                  className={className}
                  disabled={isBooked}
                  title={seat.label}
                  onClick={() => onToggleSeat(seat.id)}
                >
                  {seat.number}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
