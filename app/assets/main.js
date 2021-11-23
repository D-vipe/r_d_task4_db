"use strict";

$(document).ready(function () {
  (() => {
    function DashboardForm() {
      this.forms = {
        authForm: $("#authForm"),
        createUser: $("#createUser"),
        editUser: $("#editUser"),
      };

      this.alert = {
        window: $("#customAlert"),
        message_body: $(".alert-message"),
      };

      this.controls = {
        logout: $("#logoutBtn"),
        createUser: $(".createUser"),
        generateToken: $("#generateToken"),
        // getUserTokenList: $()
      };

      this.userTable = $("#userTableList");

      this.confirm = {
        window: $("#customConfirm"),
        confirm: $("#resolveBtn"),
        cancel: $("#rejectBtn"),
      };
    }

    const _proto = DashboardForm.prototype;

    _proto.init = function () {
      const _this = this;

      _this.authFormHandler();
      _this.newUserFormHandler();
      _this.editUserFormHandler();
      _this.logoutHandler();
      _this.controlsHandler();
      _this.tableControlsHandler();
      _this.tokenGenerateHandler();
      _this.tokenControlsHandler();
    };

    _proto.controlsHandler = function () {
      const _this = this;

      _this.controls.createUser.on("click", function (e) {
        e.preventDefault();
        $("#newUserForm").modal({ keyboard: false });
      });
    };

    _proto.logoutHandler = function () {
      const _this = this;

      _this.controls.logout.on("click", function (e) {
        e.preventDefault();

        // remove current cookie, setting it to expired and reload the page
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        location.href = "/";
      });
    };

    _proto.authFormHandler = function () {
      const _this = this;

      _this.forms.authForm.find(".formError").empty();
      _this.forms.authForm.on("submit", async function (e) {
        e.preventDefault();

        if ($(this).get(0).reportValidity()) {
          let formData = {
            userEmail: $(this).find("input[name=userEmail]").val(),
            userPass: $(this).find("input[name=userPass]").val(),
          };

          let response = await fetch("/users/auth", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          let decodedAnswer = await response.json();

          if (decodedAnswer.status == false) {
            _this.forms.authForm
              .find(".formError")
              .empty()
              .text(
                decodedAnswer.error_message ??
                  "Произошла ошибка, попробуйте позже."
              );
          } else {
            if (decodedAnswer.token) {
              let date = new Date();
              date.setTime(date.getTime()+(24*60*60*1000));
              const expires = "; expires="+date.toGMTString();
              document.cookie =
                "token=" + decodedAnswer.token + expires + "; path=/";
              location.href = "/";
            } else {
              _this.forms.authForm
                .find(".formError")
                .empty()
                .text(
                  decodedAnswer.error_message ??
                    "Произошла ошибка, попробуйте позже."
                );
            }
          }
        }

        // console.info({'action': 'submit auth form', 'name': $(this).find('input[name=userName]').val(), 'password': $(this).find('input[name=userPass]').val()});
      });
    };

    _proto.newUserFormHandler = function () {
      const _this = this;

      _this.forms.createUser.on("submit", async function (e) {
        e.preventDefault();

        if ($(this).get(0).reportValidity()) {
          let formData = {
            userName: $(this).find("input[name=name]").val(),
            userEmail: $(this).find("input[name=email]").val(),
            userPass: $(this).find("input[name=pass]").val(),
            userAge: $(this).find("input[name=age]").val(),
          };

          let response = await fetch("/users/create", {
            method: "PUT",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          let decodedAnswer = await response.json();

          if (decodedAnswer.status == false) {
            _this.forms.createUser
              .find(".formError")
              .empty()
              .text(
                decodedAnswer.error_message ??
                  "Произошла ошибка, попробуйте позже."
              );
          } else {
            if (
              decodedAnswer.userData != undefined &&
              decodedAnswer.userData != ""
            ) {
              _this.addNewUserRow(decodedAnswer.userData);
              // reset create user form
              _this.forms.createUser.get(0).reset();

              // hide modal window
              $("#newUserForm").modal("hide");
            }
          }
        } else {
          _this.forms.createUser
            .find(".formError")
            .empty()
            .text("Форма заполнена не корректно!");
        }
      });
    };

    _proto.editUserFormHandler = function () {
      const _this = this;

      _this.forms.editUser.on("submit", async function (e) {
        e.preventDefault();

        if ($(this).get(0).reportValidity()) {
          let formData = {
            userId: $(this).find("input[name=userid]").val(),
            userEmail: $(this).find("input[name=email]").val(),
            userName: $(this).find("input[name=name]").val(),
            userPass: $(this).find("input[name=pass]").val(),
            userAge: $(this).find("input[name=age]").val(),
          };

          let response = await fetch("/users/update", {
            method: "PATCH",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          let decodedAnswer = await response.json();

          if (decodedAnswer.status == false) {
            _this.forms.editUser
              .find(".formError")
              .empty()
              .text(
                decodedAnswer.error_message ??
                  "Произошла ошибка, попробуйте позже."
              );
          } else {
            if (
              decodedAnswer.userData != undefined &&
              decodedAnswer.userData != ""
            ) {
              _this.updateUserRow(decodedAnswer.userData);
              // hide modal window
              $("#editUserForm").modal("hide");

              // reset create user form
              _this.forms.editUser.get(0).reset();
            }
          }
        } else {
          _this.forms.editUser
            .find(".formError")
            .empty()
            .text("Форма заполнена не корректно!");
        }
      });
    };

    _proto.addNewUserRow = function (userData) {
      const _this = this;

      let newTr =
        '<tr data-userid="' +
        (userData.id ?? userData._id) +
        '">' +
        '<th scope="row">' +
        (userData.id ?? userData._id) +
        "</th>" +
        '<td class="userNameTd">' +
        userData.name +
        "</td>" +
        '<td class="userEmailTd">' +
        (userData.email ?? " н/д ") +
        "</td>" +
        '<td class="userAgeTd">' +
        (userData.age ?? "") +
        "</td>" +
        "<td>" +
        '<div class="actions-wrapper">' +
        '<button class="table-action-btn edit-btn" data-userid="' +
        (userData.id ?? userData._id) +
        '" data-opcode="101" title="Редактировать">' +
        '<svg width="25" aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg>' +
        "</button>" +
        '<button class="table-action-btn delete-btn" data-userid="' +
        (userData.id ?? userData._id) +
        '" data-opcode="103" title="Удалить">' +
        '<svg width="20" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>' +
        "</button>" +
        '<button class="table-action-btn token-list" data-userid="' +
        (userData.id ?? userData._id) +
        '" data-opcode="105" title="Список токенов"><svg width="20" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list" class="svg-inline--fa fa-list fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg></button>' +
        "</div>" +
        "</td>" +
        "</tr>";

      _this.userTable.find("tbody").append(newTr);
    };

    _proto.updateUserRow = function (userData) {
      const _this = this;
      _this.userTable
        .find("tr[data-userid=" + (userData.id ?? userData._id) + "]")
        .find(".userNameTd")
        .empty()
        .text(userData.name);
      _this.userTable
        .find("tr[data-userid=" + (userData.id ?? userData._id) + "]")
        .find(".userAgeTd")
        .empty()
        .text(userData.age);
    };

    _proto.tokenControlsHandler = function () {
      const _this = this;

      $(document).on("click", ".token-btn", async function (e) {
        e.preventDefault();

        let opcode = $(this).attr("data-opcode"),
          userId = $(this).attr("data-userid"),
          tokenIdx = $(this).attr("data-tokenid");

        console.log({
          token_id: tokenIdx,
          user_id: userId,
        });

        if (opcode == "107") {
          // refresh token action
          new Promise((resolve, reject) => {
            _this.confirmShow(
              resolve,
              reject,
              "Вы действительно хотите сгенерировать токен заново?"
            );
          })
            .then(async (result) => {
              let response = await fetch("/users/resetToken", {
                method: "PATCH",
                body: JSON.stringify({ userId: userId, tokenId: tokenIdx }),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              });

              let decodedAnswer = await response.json();

              if (decodedAnswer.status == true) {
                // update rows with tokens
                _this.updateTokenList(decodedAnswer.userData);
              } else {
                _this.customAlert(decodedAnswer.error_message);
              }
            })
            .catch((reason) => {});
        }

        if (opcode == "109") {
          // delete token action
          new Promise((resolve, reject) => {
            _this.confirmShow(
              resolve,
              reject,
              "Вы действительно хотите удалить токен?"
            );
          })
            .then(async (result) => {
              let response = await fetch("/users/deleteToken", {
                method: "DELETE",
                body: JSON.stringify({ userId: userId, tokenId: tokenIdx }),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              });

              let decodedAnswer = await response.json();

              if (decodedAnswer.status == true) {
                // update token rows
                _this.updateTokenList(decodedAnswer.userData);
              } else {
                _this.customAlert(decodedAnswer.error_message);
              }
            })
            .catch((reason) => {});
        }
      });
    };

    _proto.customAlert = function (message) {
      const _this = this;

      _this.alert.message_body.empty().text(message);
      _this.alert.window.modal({ keyboard: false });
    };

    _proto.tableControlsHandler = function () {
      const _this = this;

      $(document).on("click", ".table-action-btn", async function (e) {
        e.preventDefault();

        let opcode = $(this).attr("data-opcode"),
          userId = $(this).attr("data-userid");

        if (opcode == "101" || opcode == "105") {
          // find user and fetch data from file
          let response = await fetch("/users/getById", {
            method: "POST",
            body: JSON.stringify({ userId: userId }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          let decodedAnswer = await response.json();

          if (decodedAnswer.status == true) {
            if (opcode == "101") {
              // open modal window with editUserForm
              _this.showEditUserForm(decodedAnswer.userData);
            } else {
              _this.showTokenListModal(decodedAnswer.userData);
            }
          } else {
            _this.customAlert(decodedAnswer.error_message);
          }
        } else if (opcode == "103") {
          // delete action
          new Promise((resolve, reject) => {
            _this.confirmShow(
              resolve,
              reject,
              "Вы действительно хотите удалить пользователя?"
            );
          })
            .then(async () => {
              let response = await fetch("/users/deleteById", {
                method: "DELETE",
                body: JSON.stringify({ userId: userId }),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              });

              let decodedAnswer = await response.json();

              if (decodedAnswer.status == true) {
                // delete row
                _this.userTable.find("tr[data-userid=" + userId + "]").remove();
              } else {
                _this.customAlert(decodedAnswer.error_message);
              }
            })
            .catch((reason) => {
              console.log(reason);
            });
        }
      });
    };

    _proto.showEditUserForm = function (userData) {
      const _this = this;

      // populate title
      $("#editUserForm")
        .find(".modal-title")
        .empty()
        .text("Редактирование пользователя " + (userData.name ?? ""));

      // reset form
      _this.forms.editUser.get(0).reset();
      console.log({'populate edit form': userData.id ?? userData._id})
      // populate inputs
      _this.forms.editUser.find('input[name="userid"]').val(userData.id ?? userData._id);
      _this.forms.editUser.find('input[name="name"]').val(userData.name);
      _this.forms.editUser.find('input[name="email"]').val(userData.email);
      _this.forms.editUser.find('input[name="pass"]').val(userData.password);
      _this.forms.editUser.find('input[name="age"]').val(userData.age);

      // show modal
      $("#editUserForm").modal({ keyboard: false });
    };

    _proto.showTokenListModal = function (userData) {
      const _this = this;
      // populate data
      $("#userTokenList")
        .find(".modal-title")
        .empty()
        .text("Список токенов пользователя " + userData.name);

      let tokenList = "";
      $("#userTokenList").find("ul.token-list").empty();
      if (typeof userData.token == "object" && userData.token.length > 0) {
        for (let idx = 0; idx < userData.token.length; idx++) {
          tokenList +=
            '<li><div class="token-line">' +
            userData.token[idx].token +
            '<div class="token-actions">' +
            '<button class="token-btn" data-opcode="107" data-userid="' +
            (userData.id ?? userData._id) +
            '" data-tokenid="' +
            (userData.token[idx].id ?? idx) +
            '"><svg width="20" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync" class="svg-inline--fa fa-sync fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"></path></svg></button>' +
            '<button class="token-btn delete-btn" data-opcode="109" data-userid="' +
            (userData.id ?? userData._id) +
            '" data-tokenid="' +
            (userData.token[idx].id ?? idx) +
            '"><svg width="20" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg></button>';
          ("</div></div></li>");
        }
      } else {
        tokenList = "<li>Нет доступных токенов</li>";
      }

      $("#userTokenList").find("ul.token-list").append(tokenList);
      $("#userTokenList")
        .find("#generateToken")
        .attr("data-userid", userData.id ?? userData._id);
      $("#userTokenList").modal({ keyboard: false });
    };

    _proto.tokenGenerateHandler = function () {
      const _this = this;

      _this.controls.generateToken.on("click", async function (e) {
        e.preventDefault();
        let userId = $(this).attr("data-userid");

        if (userId != undefined && userId != "") {
          let response = await fetch("/users/generateToken", {
            method: "PUT",
            body: JSON.stringify({ userId: userId }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          let decodedAnswer = await response.json();

          if (decodedAnswer.status == true) {
            // add new row to list
            _this.updateTokenList(decodedAnswer.userData);
          } else {
            _this.customAlert(decodedAnswer.error_message);
          }
        } else {
          _this.customAlert("Не хватает параметров");
        }
      });
    };

    _proto.updateTokenList = function (userData) {
      const _this = this;

      let tokenList = "";
      $("#userTokenList").find("ul.token-list").empty();
      if (typeof userData.token == "object" && userData.token.length > 0) {
        for (let idx = 0; idx < userData.token.length; idx++) {
          tokenList +=
            '<li><div class="token-line">' +
            userData.token[idx].token +
            '<div class="token-actions">' +
            '<button class="token-btn" data-opcode="107" data-userid="' +
            (userData.id ?? userData._id) +
            '" data-tokenid="' +
            (userData.token[idx].id ?? idx)+
            '"><svg width="20" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync" class="svg-inline--fa fa-sync fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"></path></svg></button>' +
            '<button class="token-btn delete-btn" data-opcode="109" data-userid="' +
            (userData.id ?? userData._id) +
            '" data-tokenid="' +
            (userData.token[idx].id ?? idx) +
            '"><svg width="20" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg></button>';
          ("</div></div></li>");
        }
      }

      $("#userTokenList").find("ul.token-list").append(tokenList);
    };

    _proto.confirmShow = function (resolve, reject, message) {
      const _this = this;

      _this.confirm.window.find(".alert-message").empty().text(message);
      _this.confirm.confirm.click(() => {
        resolve(true);
        _this.confirmHide();
      });
      _this.confirm.cancel.click(() => {
        reject(false);
        _this.confirmHide();
      });
      _this.confirm.window.modal({ keyboard: false });
    };

    _proto.confirmHide = function () {
      const _this = this;

      _this.confirm.confirm.unbind("click");
      _this.confirm.cancel.unbind("click");
      _this.confirm.window.modal("hide");
    };

    return new DashboardForm();
  })().init();
});
