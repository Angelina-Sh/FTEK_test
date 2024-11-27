$(document).ready(function () {
  const cargoList = [
    {
      id: 'CARGO001',
      name: 'Строительные материалы',
      status: 'В пути',
      origin: 'Москва',
      destination: 'Казань',
      departureDate: '2024-11-30',
    },
    {
      id: 'CARGO002',
      name: 'Хрупкий груз',
      status: 'Ожидает отправки',
      origin: 'Санкт-Петербург',
      destination: 'Екатеринбург',
      departureDate: '2024-11-26',
    },
  ];

  $('#filter').on('change', function () {
    createTable($(this).val());
  });

  const createTable = (filter = false) => {
    const tbody = $('#tableBody');
    tbody.empty();
    cargoList
      .filter((cargo) => !filter || cargo.status === filter)
      .forEach((cargo) => {
        const status =
          cargo.status === 'Ожидает отправки'
            ? 'table-warning'
            : cargo.status === 'В пути'
            ? 'table-primary'
            : 'table-success';
        const trow = `
            <tr>
              <td>${cargo.id}</td>
              <td>${cargo.name}</td>
              <td class=${status}>
                <select data-id="${cargo.id}" class="form-select cargo-select text-center">
                  <option value="Ожидает отправки" ${
                    cargo.status == 'Ожидает отправки' ? 'selected' : ''
                  }>Ожидает отправки</option>
                  <option value="В пути" ${
                    cargo.status == 'В пути' ? 'selected' : ''
                  }>В пути</option>
                  <option value="Доставлен" ${
                    cargo.status == 'Доставлен' ? 'selected' : ''
                  }>Доставлен</option>
                </select>
                <div class="form-text d-none text-danger select-error">Дата отправления находится в будущем</div>
              </td>
              <td>${cargo.origin}</td>
              <td>${cargo.destination}</td>
              <td>${cargo.departureDate}</td>
            </tr>
        `;
        tbody.append(trow);
      });
  };

  $(document).on('change', 'select', function () {
    const cargo = cargoList.find((elem) => elem.id === $(this).data('id'));
    if ($(this).val() === 'Доставлен' && new Date(cargo.departureDate) > new Date()) {
      $(this).addClass('alert-danger');
      $(this).closest('td').find('.select-error').removeClass('d-none');
    } else {
      $(this).removeClass('alert-danger');
      $(this).closest('td').find('.select-error').addClass('d-none');
      cargo.status = $(this).val();
      createTable($('#filter').val());
    }
  });

  $('#open-form').on('click', function () {
    $('form').removeClass('d-none');
    $(this).addClass('d-none');
  });

  $('form').on('submit', function (event) {
    event.preventDefault();
    const newCargo = {
      id: `CARGO${(cargoList.length + 1).toString().padStart(3, '0')}`,
      name: $('#name').val(),
      status: 'Ожидает отправки',
      origin: $('#origin').val(),
      destination: $('#destination').val(),
      departureDate: $('#date').val(),
    };
    cargoList.push(newCargo);
    createTable($('#filter').val());
    this.reset();
    $(this).addClass('d-none');
    $('#open-form').removeClass('d-none');
  });

  createTable($('#filter').val());
});
