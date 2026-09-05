import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
} from "lucide-react";

import { T, CATEGORIES } from "../data/site";

import {
  SeaIcon,
  Pill,
  Button,
  StepIndicator,
  Row,
  navLinkStyle,
  stepperBtn,
} from "../components/ui";

import { money, orderTypeLabel } from "../utils/helpers";

import type {
  Cart,
  OrderType,
} from "../types";

interface CartPageProps {
  cart: Cart;
  incItem: (id: string) => void;
  decItem: (id: string) => void;
  removeItem: (id: string) => void;

  orderType: OrderType | null;

  subtotal: number;
  deliveryFee: number;
  total: number;

  goMenu: () => void;
  goCheckout: () => void;
  changeOrderType: () => void;
}

export default function CartPage({
  cart,
  incItem,
  decItem,
  removeItem,
  orderType,
  subtotal,
  deliveryFee,
  total,
  goMenu,
  goCheckout,
  changeOrderType,
}: CartPageProps) {
  const lines = Object.values(cart);

  return (
    <div
      style={{
        background: T.sand,
        minHeight: "75vh",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        {/* Back to menu */}
        <button
          onClick={goMenu}
          style={{
            ...navLinkStyle,
            color: T.ink,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={15} />
          Back to menu
        </button>

        <StepIndicator step={2} />

        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(24px,3vw,32px)",
            fontWeight: 600,
            color: T.ink,
            marginBottom: 6,
          }}
        >
          Your Cart
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <Pill tone="tide">
            {orderTypeLabel(orderType)}
          </Pill>

          <button
            onClick={changeOrderType}
            style={{
              ...navLinkStyle,
              color: T.coral,
              fontSize: 12.5,
            }}
          >
            Change
          </button>
        </div>

        {/* Empty cart */}
        {lines.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 50,
              textAlign: "center",
              border: `1.5px solid ${T.line}`,
            }}
          >
            <p
              style={{
                color: T.ink60,
                marginBottom: 18,
              }}
            >
              Your cart is empty. Add something delicious.
            </p>

            <Button
              variant="dark"
              onClick={goMenu}
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1.5px solid ${T.line}`,
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              {lines.map((line, i) => (
                <div
                  key={line.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 18px",
                    borderBottom:
                      i < lines.length - 1
                        ? `1px solid ${T.line}`
                        : "none",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      background: T.tideLight,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SeaIcon
                      type={
                        CATEGORIES.find(
                          (c) => c.id === line.category
                        )?.icon
                      }
                      size={22}
                      color={T.tide}
                    />
                  </div>

                  {/* Name */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: T.ink,
                        fontSize: 15,
                      }}
                    >
                      {line.name}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: T.ink60,
                      }}
                    >
                      {money(line.price)} each
                    </div>
                  </div>

                  {/* Quantity */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: T.sand,
                      borderRadius: 8,
                      padding: "5px 8px",
                    }}
                  >
                    <button
                      onClick={() => decItem(line.id)}
                      style={stepperBtn}
                    >
                      <Minus size={13} />
                    </button>

                    <span
                      style={{
                        fontWeight: 700,
                        minWidth: 16,
                        textAlign: "center",
                      }}
                    >
                      {line.qty}
                    </span>

                    <button
                      onClick={() => incItem(line.id)}
                      style={stepperBtn}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Item total */}
                  <div
                    style={{
                      fontWeight: 700,
                      color: T.ink,
                      minWidth: 66,
                      textAlign: "right",
                    }}
                  >
                    {money(line.price * line.qty)}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(line.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2
                      size={16}
                      color={T.coralDeep}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1.5px solid ${T.line}`,
                padding: 20,
              }}
            >
              <Row
                label="Subtotal"
                value={money(subtotal)}
              />

              {orderType === "delivery" && (
                <Row
                  label="Delivery charge"
                  value={money(deliveryFee)}
                />
              )}

              <div
                style={{
                  borderTop: `1px solid ${T.line}`,
                  margin: "10px 0",
                }}
              />

              <Row
                label="Total"
                value={money(total)}
                bold
              />

              <div style={{ marginTop: 18 }}>
                <Button
                  variant="primary"
                  size="lg"
                  full
                  onClick={goCheckout}
                >
                  Proceed to Checkout
                  <ChevronRight size={17} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}