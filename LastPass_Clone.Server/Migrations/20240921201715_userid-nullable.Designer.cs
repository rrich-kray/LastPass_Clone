﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PasswordManager.Server.Data.DatabaseContexts;

#nullable disable

namespace LastPass_Clone.Server.Migrations
{
    [DbContext(typeof(PasswordManagerDatabaseContext))]
    [Migration("20240921201715_userid-nullable")]
    partial class useridnullable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.8");

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.Address", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Address1")
                        .HasColumnType("TEXT");

                    b.Property<string>("Address2")
                        .HasColumnType("TEXT");

                    b.Property<string>("Address3")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Birthday")
                        .HasColumnType("TEXT");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("City")
                        .HasColumnType("TEXT");

                    b.Property<string>("Company")
                        .HasColumnType("TEXT");

                    b.Property<string>("Country")
                        .HasColumnType("TEXT");

                    b.Property<string>("County")
                        .HasColumnType("TEXT");

                    b.Property<string>("EmailAddress")
                        .HasColumnType("TEXT");

                    b.Property<int?>("EveningPhone")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Fax")
                        .HasColumnType("INTEGER");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Gender")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("MiddleName")
                        .HasColumnType("TEXT");

                    b.Property<int?>("MobilePhone")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<int?>("PhoneNumber")
                        .HasColumnType("INTEGER");

                    b.Property<string>("State")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.Property<int?>("ZipCode")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("UserId");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.BankAccount", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AccountNumber")
                        .HasColumnType("TEXT");

                    b.Property<string>("AccountType")
                        .HasColumnType("TEXT");

                    b.Property<string>("BankName")
                        .HasColumnType("TEXT");

                    b.Property<string>("BranchAddress")
                        .HasColumnType("TEXT");

                    b.Property<string>("BranchPhone")
                        .HasColumnType("TEXT");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("IBANNumber")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<string>("PIN")
                        .HasColumnType("TEXT");

                    b.Property<string>("RoutingNumber")
                        .HasColumnType("TEXT");

                    b.Property<string>("SWIFTCode")
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("UserId");

                    b.ToTable("BankAccounts");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Categories");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Business"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Arts"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Productivity Tools"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Shopping"
                        },
                        new
                        {
                            Id = 5,
                            Name = "Email"
                        },
                        new
                        {
                            Id = 6,
                            Name = "Social"
                        },
                        new
                        {
                            Id = 7,
                            Name = "Entertainment"
                        });
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.Note", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("UserId");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.PasswordInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.Property<string>("Website")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("UserId");

                    b.ToTable("Passwords");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.PaymentCard", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ExpirationDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("NameOnCard")
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<string>("Number")
                        .HasColumnType("TEXT");

                    b.Property<int?>("SecurityCode")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Type")
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("UserId");

                    b.ToTable("PaymentCards");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("MiddleName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Roles")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.Address", b =>
                {
                    b.HasOne("PasswordManager.Server.Data.Entities.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("PasswordManager.Server.Data.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.BankAccount", b =>
                {
                    b.HasOne("PasswordManager.Server.Data.Entities.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("PasswordManager.Server.Data.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.Note", b =>
                {
                    b.HasOne("PasswordManager.Server.Data.Entities.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("PasswordManager.Server.Data.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.PasswordInfo", b =>
                {
                    b.HasOne("PasswordManager.Server.Data.Entities.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("PasswordManager.Server.Data.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("PasswordManager.Server.Data.Entities.PaymentCard", b =>
                {
                    b.HasOne("PasswordManager.Server.Data.Entities.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("PasswordManager.Server.Data.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId");
                });
#pragma warning restore 612, 618
        }
    }
}
